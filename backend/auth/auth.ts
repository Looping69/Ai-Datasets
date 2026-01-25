import { api, APIError, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { secret } from "encore.dev/config";
import * as bcrypt from "bcryptjs";

// Database for users
const db = new SQLDatabase("auth", {
    migrations: "./migrations",
});

// JWT secret for token signing
const jwtSecret = secret("JWTSecret");

// Types
interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthToken {
    token: string;
    expiresAt: number;
}

// Request/Response types
interface SignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface AuthResponse {
    user: User;
    token: AuthToken;
}

interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// Helper: Generate JWT-like token (simplified)
function generateToken(userId: number): AuthToken {
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const payload = JSON.stringify({ userId, exp: expiresAt });
    const token = Buffer.from(payload).toString("base64");
    return { token, expiresAt };
}

// Helper: Verify and decode token
function verifyToken(token: string): { userId: number } | null {
    try {
        const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
        if (payload.exp < Date.now()) return null;
        return { userId: payload.userId };
    } catch {
        return null;
    }
}

// ============ AUTH HANDLER ============

interface AuthData {
    userId: number;
}

// Define the authentication handler for the application
export const myAuthHandler = authHandler(async (params: { authorization: Header }): Promise<AuthData> => {
    const authHeader = params.authorization;
    if (!authHeader.startsWith("Bearer ")) {
        throw APIError.unauthenticated("Missing authorization header");
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
        throw APIError.unauthenticated("Invalid or expired token");
    }

    return { userId: decoded.userId };
});

// ============ PUBLIC ENDPOINTS ============

// Signup - Create new user
export const signup = api(
    { expose: true, method: "POST", path: "/auth/signup" },
    async (req: SignupRequest): Promise<AuthResponse> => {
        // Validate input
        if (!req.email || !req.password || !req.firstName || !req.lastName) {
            throw APIError.invalidArgument("All fields are required");
        }

        if (req.password.length < 8) {
            throw APIError.invalidArgument("Password must be at least 8 characters");
        }

        // Check if email exists
        const existing = await db.queryRow`
            SELECT id FROM users WHERE email = ${req.email.toLowerCase()}
        `;
        if (existing) {
            throw APIError.alreadyExists("Email already registered");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(req.password, 12);

        // Insert user
        const result = await db.queryRow<{ id: number }>`
            INSERT INTO users (email, password_hash, first_name, last_name)
            VALUES (${req.email.toLowerCase()}, ${passwordHash}, ${req.firstName}, ${req.lastName})
            RETURNING id
        `;

        if (!result) throw APIError.internal("Failed to create user");

        // Fetch complete user
        const user = await db.queryRow<User>`
            SELECT id, email, first_name as "firstName", last_name as "lastName", 
                   avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt"
            FROM users WHERE id = ${result.id}
        `;

        if (!user) throw APIError.internal("Failed to fetch user");

        return {
            user,
            token: generateToken(result.id),
        };
    }
);

// Login - Authenticate user
export const login = api(
    { expose: true, method: "POST", path: "/auth/login" },
    async (req: LoginRequest): Promise<AuthResponse> => {
        if (!req.email || !req.password) {
            throw APIError.invalidArgument("Email and password are required");
        }

        const row = await db.queryRow<{ id: number; password_hash: string }>`
            SELECT id, password_hash FROM users WHERE email = ${req.email.toLowerCase()}
        `;

        if (!row) {
            throw APIError.unauthenticated("Invalid email or password");
        }

        const valid = await bcrypt.compare(req.password, row.password_hash);
        if (!valid) {
            throw APIError.unauthenticated("Invalid email or password");
        }

        const user = await db.queryRow<User>`
            SELECT id, email, first_name as "firstName", last_name as "lastName",
                   avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt"
            FROM users WHERE id = ${row.id}
        `;

        if (!user) throw APIError.internal("Failed to fetch user");

        return {
            user,
            token: generateToken(row.id),
        };
    }
);

// ============ PROTECTED ENDPOINTS ============

// Get current user profile
export const getProfile = api(
    { expose: true, method: "GET", path: "/auth/profile", auth: true },
    async (_, { auth }: { auth: AuthData }): Promise<{ user: User }> => {
        const user = await db.queryRow<User>`
            SELECT id, email, first_name as "firstName", last_name as "lastName",
                   avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt"
            FROM users WHERE id = ${auth.userId}
        `;

        if (!user) throw APIError.notFound("User not found");

        return { user };
    }
);

// Update profile
export const updateProfile = api(
    { expose: true, method: "PUT", path: "/auth/profile", auth: true },
    async (req: UpdateProfileRequest, { auth }: { auth: AuthData }): Promise<{ user: User }> => {
        await db.exec`
            UPDATE users 
            SET first_name = COALESCE(${req.firstName}, first_name),
                last_name = COALESCE(${req.lastName}, last_name),
                avatar_url = COALESCE(${req.avatarUrl}, avatar_url),
                updated_at = NOW()
            WHERE id = ${auth.userId}
        `;

        const user = await db.queryRow<User>`
            SELECT id, email, first_name as "firstName", last_name as "lastName",
                   avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt"
            FROM users WHERE id = ${auth.userId}
        `;

        if (!user) throw APIError.notFound("User not found");

        return { user };
    }
);

// Change password
export const changePassword = api(
    { expose: true, method: "POST", path: "/auth/change-password", auth: true },
    async (req: ChangePasswordRequest, { auth }: { auth: AuthData }): Promise<{ success: boolean }> => {
        if (!req.currentPassword || !req.newPassword) {
            throw APIError.invalidArgument("Current and new passwords are required");
        }

        if (req.newPassword.length < 8) {
            throw APIError.invalidArgument("New password must be at least 8 characters");
        }

        const row = await db.queryRow<{ password_hash: string }>`
            SELECT password_hash FROM users WHERE id = ${auth.userId}
        `;

        if (!row) throw APIError.notFound("User not found");

        const valid = await bcrypt.compare(req.currentPassword, row.password_hash);
        if (!valid) {
            throw APIError.unauthenticated("Current password is incorrect");
        }

        const newHash = await bcrypt.hash(req.newPassword, 12);
        await db.exec`
            UPDATE users SET password_hash = ${newHash}, updated_at = NOW()
            WHERE id = ${auth.userId}
        `;

        return { success: true };
    }
);

// Delete account
export const deleteAccount = api(
    { expose: true, method: "DELETE", path: "/auth/account", auth: true },
    async (_, { auth }: { auth: AuthData }): Promise<{ success: boolean }> => {
        await db.exec`DELETE FROM users WHERE id = ${auth.userId}`;
        return { success: true };
    }
);
