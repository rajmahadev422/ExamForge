'use client';

import AuthButton from '@/components/AuthButton';
import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      console.log('Login:', { email, password });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Glow orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'var(--accent)', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
      <div className="fixed bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none opacity-15"
        style={{ background: 'var(--accent3)', filter: 'blur(80px)', transform: 'translate(-30%, 30%)' }} />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl p-10 animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-10 right-10 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,var(--accent),transparent)' }} />

        {/* Icon */}
        <div className="w-13 h-13 rounded-xl flex items-center justify-center mb-5"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
            boxShadow: '0 0 24px color-mix(in srgb, var(--accent) 40%, transparent)',
          }}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
          Welcome back
        </h2>
        <p className="text-xs font-mono font-light mb-7" style={{ color: 'var(--text-dim)' }}>
          // sign in to continue
        </p>

        {/* Error */}
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm mb-5"
            style={{
              background: 'color-mix(in srgb, var(--accent2) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent2) 30%, transparent)',
              color: 'var(--accent2)',
            }}>
            {error}
          </div>
        )}

        {/* Fields */}
        {[
          { id: 'email', label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
          { id: 'password', label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /> },
        ].map(({ id, label, type, value, set, placeholder, icon }) => (
          <div key={id} className="mb-4">
            <label htmlFor={id} className="block text-xs font-mono font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--text-dim)' }}>
              {label}
            </label>
            <div className="relative">
              <input
                id={id} type={type} value={value} placeholder={placeholder}
                autoComplete={id === 'email' ? 'email' : 'current-password'}
                onChange={e => set(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: 'var(--text-dimmer)' }}>
                {icon}
              </svg>
            </div>
          </div>
        ))}

        <div className="flex justify-end mb-5">
          <a href="#" className="text-xs font-mono transition-colors"
            style={{ color: 'var(--text-dim)' }}
            onMouseOver={e => e.target.style.color = 'var(--accent)'}
            onMouseOut={e => e.target.style.color = 'var(--text-dim)'}>
            Forgot password?
          </a>
        </div>

        {/* Sign in button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 4px 20px color-mix(in srgb,var(--accent) 35%,transparent)',
          }}
        >
          {isLoading
            ? <svg className="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            : 'Sign in'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-dimmer)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* Google */}
        <AuthButton />

        <p className="text-center text-xs font-mono font-light mt-6" style={{ color: 'var(--text-dim)' }}>
          No account?{' '}
          <a href="#" className="font-medium" style={{ color: 'var(--accent)' }}>Sign up →</a>
        </p>
      </div>
    </div>
  );
}
