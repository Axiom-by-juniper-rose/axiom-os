import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { IS_APP_DOMAIN } from '../App';

type AuthMode = 'login' | 'signup';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError(null);
        setSuccess(null);
        setPassword('');
        setConfirmPassword('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            if (IS_APP_DOMAIN) {
                navigate(`/${window.location.search}`);
            } else {
                window.location.href = 'https://app.buildaxiom.dev';
            }
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            setLoading(false);
            return;
        }

        // Check beta allowlist before attempting signup
        const { data: allowed, error: allowlistError } = await supabase
            .from('beta_allowlist')
            .select('email')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle();

        if (allowlistError || !allowed) {
            setError(
                'This email is not on the beta access list. ' +
                'If you signed an NDA and were approved, contact us to verify.'
            );
            setLoading(false);
            return;
        }

        // Create the account
        const { error: signUpError } = await supabase.auth.signUp({
            email: email.toLowerCase().trim(),
            password,
        });

        if (signUpError) {
            // Handle "User already registered" gracefully
            if (signUpError.message.toLowerCase().includes('already registered') ||
                signUpError.message.toLowerCase().includes('already exists')) {
                setError('An account with this email already exists. Use Sign In instead.');
            } else {
                setError(signUpError.message);
            }
            setLoading(false);
        } else {
            setSuccess(
                'Account created! Check your email for a confirmation link, ' +
                'then return here to sign in.'
            );
            setPassword('');
            setConfirmPassword('');
            setLoading(false);
        }
    };

    const isSignupMode = mode === 'signup';

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px 12px 48px',
        borderRadius: 8,
        backgroundColor: '#0A0A0A',
        border: '1px solid #333',
        color: '#fff',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    };

    return (
        <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
            <div style={{
                width: '100%',
                maxWidth: 420,
                padding: 40,
                backgroundColor: '#111',
                borderRadius: 16,
                border: '1px solid #222',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                textAlign: 'center',
            }}>
                {/* Logo */}
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '2px', color: '#fff', marginBottom: 40 }}>
                    ⬡ AXIOM<span style={{ color: '#D4A843' }}>OS</span>
                </div>

                {/* Heading */}
                <h2 style={{ fontSize: 20, color: '#fff', marginBottom: 12 }}>
                    {isSignupMode ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>
                    {isSignupMode
                        ? 'Beta access — enter your invite email to get started'
                        : 'Authenticate to access your workspace'}
                </p>

                {/* Error */}
                {error && (
                    <div style={{
                        marginBottom: 24,
                        padding: '12px 16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#FCA5A5',
                        borderRadius: 8,
                        fontSize: 13,
                        textAlign: 'left',
                    }}>
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div style={{
                        marginBottom: 24,
                        padding: '12px 16px',
                        backgroundColor: 'rgba(52, 211, 153, 0.1)',
                        border: '1px solid rgba(52, 211, 153, 0.2)',
                        color: '#6EE7B7',
                        borderRadius: 8,
                        fontSize: 13,
                        textAlign: 'left',
                    }}>
                        {success}
                    </div>
                )}

                <form
                    onSubmit={isSignupMode ? handleSignUp : handleLogin}
                    style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                >
                    {/* Email */}
                    <div style={{ textAlign: 'left' }}>
                        <label style={labelStyle}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#D4A843'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ textAlign: 'left' }}>
                        <label style={labelStyle}>
                            {isSignupMode ? 'Choose a Password' : 'Password'}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isSignupMode ? 'Min. 8 characters' : ''}
                                style={inputStyle}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#D4A843'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
                                required
                            />
                        </div>
                    </div>

                    {/* Confirm Password (signup only) */}
                    {isSignupMode && (
                        <div style={{ textAlign: 'left' }}>
                            <label style={labelStyle}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    style={inputStyle}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#D4A843'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Primary CTA */}
                    <div style={{ marginTop: 12 }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: 8,
                                backgroundColor: '#D4A843',
                                color: '#000',
                                border: 'none',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'transform 0.1s, background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                            }}
                        >
                            {loading
                                ? <Loader2 className="animate-spin" size={20} />
                                : isSignupMode
                                    ? <><span>Create Account</span><ArrowRight size={18} /></>
                                    : <><span>Sign In</span><ArrowRight size={18} /></>
                            }
                        </button>
                    </div>

                    {/* Mode toggle */}
                    <div style={{ marginTop: 4 }}>
                        <button
                            type="button"
                            onClick={() => switchMode(isSignupMode ? 'login' : 'signup')}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: 8,
                                backgroundColor: 'transparent',
                                color: '#D4A843',
                                border: '1px solid #D4A843',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: 1,
                            }}
                        >
                            {isSignupMode ? 'Already have an account? Sign In' : 'Beta user? Create Account'}
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: 32, fontSize: 12, color: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Shield size={12} /> Secure Enterprise Authentication
                </div>
            </div>
        </div>
    );
};
