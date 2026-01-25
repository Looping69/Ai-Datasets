import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as authService from '../services/auth/authService';
import type { User } from '../services/auth/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: { firstName?: string; lastName?: string; avatarUrl?: string }) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from storage
    useEffect(() => {
        const storedUser = authService.getStoredUser();
        const token = authService.getStoredToken();

        if (storedUser && token) {
            setUser(storedUser);
            // Optionally refresh from server
            authService.getProfile()
                .then(({ user }) => setUser(user))
                .catch(() => {
                    authService.clearAuth();
                    setUser(null);
                });
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await authService.login(email, password);
        setUser(response.user);
    }, []);

    const signup = useCallback(async (
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ) => {
        const response = await authService.signup(email, password, firstName, lastName);
        setUser(response.user);
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (data: {
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
    }) => {
        const response = await authService.updateProfile(data);
        setUser(response.user);
    }, []);

    const changePassword = useCallback(async (
        currentPassword: string,
        newPassword: string
    ) => {
        await authService.changePassword(currentPassword, newPassword);
    }, []);

    const deleteAccount = useCallback(async () => {
        await authService.deleteAccount();
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const { user } = await authService.getProfile();
            setUser(user);
        } catch {
            authService.clearAuth();
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading,
                login,
                signup,
                logout,
                updateProfile,
                changePassword,
                deleteAccount,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
