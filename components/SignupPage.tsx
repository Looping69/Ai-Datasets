import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SignupPageProps {
    onSwitchToLogin: () => void;
    onBack: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin, onBack }) => {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await signup(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
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
                        <div className="inline-block bg-[var(--green-status)] p-3 mb-4" style={{ clipPath: 'var(--clip-panel-sm)' }}>
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="hud-title text-3xl mb-2">CREATE ACCOUNT</h1>
                        <p className="text-[var(--text-dim)]">Join the DataScout network</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-[var(--red-error)]/10 border border-[var(--red-error)] text-[var(--red-error)]" style={{ clipPath: 'var(--clip-panel-sm)' }}>
                            <span className="hud-label">ERROR:</span> {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="hud-label block mb-2">FIRST NAME</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="hud-input"
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div>
                                <label className="hud-label block mb-2">LAST NAME</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="hud-input"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="hud-label block mb-2">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="hud-input"
                                placeholder="Minimum 8 characters"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div>
                            <label className="hud-label block mb-2">CONFIRM PASSWORD</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="hud-input"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
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
                                    CREATING ACCOUNT...
                                </span>
                            ) : (
                                'CREATE ACCOUNT'
                            )}
                        </button>
                    </form>

                    <div className="hud-divider my-6"></div>

                    {/* Footer Links */}
                    <div className="text-center space-y-4">
                        <p className="text-[var(--text-dim)]">
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-[var(--cyan-primary)] hover:underline font-bold"
                            >
                                Login
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

export default SignupPage;
