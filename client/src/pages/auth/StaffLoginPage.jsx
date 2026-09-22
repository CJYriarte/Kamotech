import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/branding/logo.png';
import bgStaffPortal from '../../assets/branding/bg-staff-portal.png';


export default function StaffLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid staff credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgStaffPortal})` }}
    >
      <div className="absolute inset-0 bg-navy-main/70" />

      <div className="relative z-10 w-full max-w-sm bg-navy-main/90 border border-navy-deep rounded-2xl p-8 shadow-softLg backdrop-blur-sm">

        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="SkySurfers" className="h-16 w-auto mb-3" />
          <h1 className="text-white font-bold text-xl">SkySurfers Portal</h1>
          <p className="text-cyan-light text-sm mt-1">Sign in to manage the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-cyan-light" />
            <input
              type="email" name="email" required placeholder="Username / Email"
              value={form.email} onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 rounded-lg bg-navy-deep border border-navy-deep text-white text-sm placeholder-cyan-light/60 focus:outline-none focus:ring-2 focus:ring-sky-primary"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-cyan-light" />
            <input
              type="password" name="password" required placeholder="Password"
              value={form.password} onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 rounded-lg bg-navy-deep border border-navy-deep text-white text-sm placeholder-cyan-light/60 focus:outline-none focus:ring-2 focus:ring-sky-primary"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-300 bg-rose-950/50 border border-rose-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-brand-red hover:bg-brand-redDeep text-white font-semibold text-sm transition-all disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-xs text-cyan-light mt-6">
          Not staff?{' '}
          <Link to="/login" className="text-white font-medium hover:underline">
            Go to customer login
          </Link>
        </p>
      </div>
    </div>
  );
}