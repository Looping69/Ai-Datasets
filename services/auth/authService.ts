// Auth API client for Encore backend
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthToken {
    token: string;
    expiresAt: number;
}

export interface AuthResponse {
    user: User;
    token: AuthToken;
}

// Storage keys
const TOKEN_KEY = 'datascout_auth_token';
const USER_KEY = 'datascout_user';

// Get stored auth data
export function getStoredToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    // Check if expired
    try {
        const payload = JSON.parse(atob(token));
        if (payload.exp < Date.now()) {
            clearAuth();
            return null;
        }
        return token;
    } catch {
        clearAuth();
        return null;
    }
}

export function getStoredUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function storeAuth(user: User, token: AuthToken): void {
    localStorage.setItem(TOKEN_KEY, token.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// API helpers
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getStoredToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// Auth API functions
export async function signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName }),
    });

    storeAuth(response.user, response.token);
    return response;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    storeAuth(response.user, response.token);
    return response;
}

export async function getProfile(): Promise<{ user: User }> {
    return apiRequest<{ user: User }>('/auth/profile', { method: 'GET' });
}

export async function updateProfile(data: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}): Promise<{ user: User }> {
    const response = await apiRequest<{ user: User }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });

    // Update stored user
    storeAuth(response.user, { token: getStoredToken()!, expiresAt: 0 });
    return response;
}

export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
    });
}

export async function deleteAccount(): Promise<{ success: boolean }> {
    const response = await apiRequest<{ success: boolean }>('/auth/account', {
        method: 'DELETE',
    });

    clearAuth();
    return response;
}

export function logout(): void {
    clearAuth();
}

export function isAuthenticated(): boolean {
    return getStoredToken() !== null;
}
