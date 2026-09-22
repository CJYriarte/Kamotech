import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Lock } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    await supabase.auth.signOut();
    setTimeout(() => navigate('/login'), 2500);
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

        {success ? (
          <div className="text-center space-y-3">
            <h1 className="text-lg font-bold text-navy-main">Password updated</h1>
            <p className="text-sm text-slate-500">Redirecting you to log in with your new password…</p>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-navy-main text-center mb-1">Set a new password</h1>
            <p className="text-sm text-slate-500 text-center mb-6">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password" required placeholder="New password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password" required placeholder="Confirm new password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Updating…' : 'Update Password'}
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