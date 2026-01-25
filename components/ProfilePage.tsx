import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
    onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
    const { user, updateProfile, changePassword, deleteAccount, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'danger'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        avatarUrl: user?.avatarUrl || '',
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            await updateProfile(profileForm);
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setError('New password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            setSuccess('Password changed successfully');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Password change failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        setIsLoading(true);
        try {
            await deleteAccount();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-void)]">
            {/* Header */}
            <header className="w-full px-8 py-6 border-b border-[var(--border-dim)] bg-[var(--bg-panel)] sticky top-0 z-50 hud-frame">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="hud-button text-sm">
                            ← BACK
                        </button>
                        <h1 className="hud-title text-xl">PROFILE SETTINGS</h1>
                    </div>
                    <button onClick={logout} className="hud-button text-sm">
                        LOGOUT
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-8 py-12">
                {/* User Info Header */}
                <div className="hud-frame hud-frame-glow p-8 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[var(--cyan-primary)] flex items-center justify-center text-white text-3xl font-bold" style={{ clipPath: 'var(--clip-panel)' }}>
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                            <h2 className="hud-title text-2xl">{user.firstName} {user.lastName}</h2>
                            <p className="text-[var(--text-dim)]">{user.email}</p>
                            <div className="hud-status mt-2">ACCOUNT ACTIVE</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {['profile', 'security', 'danger'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`hud-label px-6 py-3 transition-all ${activeTab === tab
                                    ? 'bg-[var(--cyan-primary)] text-white'
                                    : 'bg-[var(--bg-surface)] text-[var(--text-dim)] hover:text-[var(--text-bright)]'
                                }`}
                            style={{ clipPath: 'var(--clip-panel-sm)' }}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-[var(--red-error)]/10 border border-[var(--red-error)] text-[var(--red-error)]" style={{ clipPath: 'var(--clip-panel-sm)' }}>
                        <span className="hud-label">ERROR:</span> {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-[var(--green-status)]/10 border border-[var(--green-status)] text-[var(--green-status)]" style={{ clipPath: 'var(--clip-panel-sm)' }}>
                        <span className="hud-label">SUCCESS:</span> {success}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="hud-frame p-8">
                        <h3 className="hud-title text-xl mb-6">PROFILE INFORMATION</h3>
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="hud-label block mb-2">FIRST NAME</label>
                                    <input
                                        type="text"
                                        value={profileForm.firstName}
                                        onChange={(e) => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                                        className="hud-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="hud-label block mb-2">LAST NAME</label>
                                    <input
                                        type="text"
                                        value={profileForm.lastName}
                                        onChange={(e) => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                                        className="hud-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="hud-label block mb-2">AVATAR URL (OPTIONAL)</label>
                                <input
                                    type="url"
                                    value={profileForm.avatarUrl}
                                    onChange={(e) => setProfileForm(p => ({ ...p, avatarUrl: e.target.value }))}
                                    className="hud-input"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>

                            <div>
                                <label className="hud-label block mb-2">EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    className="hud-input opacity-50"
                                    disabled
                                />
                                <p className="text-xs text-[var(--text-muted)] mt-1">Email cannot be changed</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="hud-button-primary"
                            >
                                {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="hud-frame p-8">
                        <h3 className="hud-title text-xl mb-6">CHANGE PASSWORD</h3>
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div>
                                <label className="hud-label block mb-2">CURRENT PASSWORD</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                    className="hud-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="hud-label block mb-2">NEW PASSWORD</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                                    className="hud-input"
                                    placeholder="Minimum 8 characters"
                                    required
                                />
                            </div>

                            <div>
                                <label className="hud-label block mb-2">CONFIRM NEW PASSWORD</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                    className="hud-input"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="hud-button-primary"
                            >
                                {isLoading ? 'CHANGING...' : 'CHANGE PASSWORD'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Danger Zone Tab */}
                {activeTab === 'danger' && (
                    <div className="hud-frame p-8 border-[var(--red-error)]">
                        <h3 className="hud-title text-xl mb-4 text-[var(--red-error)]">DANGER ZONE</h3>
                        <p className="text-[var(--text-dim)] mb-6">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            className="px-6 py-3 bg-[var(--red-error)] text-white font-bold hover:bg-red-700 transition-colors"
                            style={{ clipPath: 'var(--clip-button)' }}
                        >
                            {isLoading ? 'DELETING...' : 'DELETE MY ACCOUNT'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
