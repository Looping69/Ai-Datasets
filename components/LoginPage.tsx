import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
    onSwitchToSignup: () => void;
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onBack }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="hud-frame p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-[var(--cyan-primary)] p-3 mb-4" style={{ clipPath: 'var(--clip-panel-sm)' }}>
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="hud-title text-3xl mb-2">SYSTEM LOGIN</h1>
                        <p className="text-[var(--text-dim)]">Access your DataScout account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-[var(--red-error)]/10 border border-[var(--red-error)] text-[var(--red-error)]" style={{ clipPath: 'var(--clip-panel-sm)' }}>
                            <span className="hud-label">ERROR:</span> {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="hud-label block mb-2">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="hud-input"
                                placeholder="agent@datascout.ai"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="hud-label block mb-2">PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="hud-input"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="hud-button-primary w-full"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    AUTHENTICATING...
                                </span>
                            ) : (
                                'LOGIN'
                            )}
                        </button>
                    </form>

                    <div className="hud-divider my-6"></div>

                    {/* Footer Links */}
                    <div className="text-center space-y-4">
                        <p className="text-[var(--text-dim)]">
                            Don't have an account?{' '}
                            <button
                                onClick={onSwitchToSignup}
                                className="text-[var(--cyan-primary)] hover:underline font-bold"
                            >
                                Create Account
                            </button>
                        </p>
                        <button
                            onClick={onBack}
                            className="hud-button text-sm"
                        >
                            ← BACK TO HOME
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
