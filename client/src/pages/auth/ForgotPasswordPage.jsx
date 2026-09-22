import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-sky-primary p-2 rounded-lg text-white">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-navy-main">SkySurfers</span>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <h1 className="text-lg font-bold text-navy-main">Check your email</h1>
            <p className="text-sm text-slate-500">
              If an account exists for <span className="font-medium">{email}</span>, we've sent a link to reset your password.
            </p>
            <Link to="/login" className="text-sky-primary text-sm font-medium hover:underline">
              Back to Log In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-navy-main text-center mb-1">Reset your password</h1>
            <p className="text-sm text-slate-500 text-center mb-6">
              Enter the email associated with your account and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email" required placeholder="Email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-lg bg-sky-primary hover:bg-sky-deep text-white font-semibold text-sm transition-all disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">
              <Link to="/login" className="text-sky-primary font-medium hover:underline">
                Back to Log In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}