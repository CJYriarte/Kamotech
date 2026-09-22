import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/branding/logo.png';
import bgLogin from '../../assets/branding/bg-login.png';


const highlights = [
  'Visa Assistance',
  'Cruise Tours',
  'Hotel Booking',
  '24/7 AI Travel Assistant',
];


export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '', fullName: '', contactNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
      } else {
        await signUp(form.email, form.password, form.fullName, form.contactNumber);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">

      <div
        className="hidden lg:flex lg:w-1/2 relative text-white flex-col justify-between p-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgLogin})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-navy-main/80 via-navy-main/30 to-transparent" />

        <div className="relative z-10" />

        <div className="relative z-10">
          <h1 className="text-4xl font-black leading-tight mb-4">
            Explore More.<br />Fly High.
          </h1>
          <p className="text-white/90 max-w-sm mb-8">
            Your journey, our passion. Handcrafted travel packages, real support,
            and an AI assistant that's with you every step of the way.
          </p>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="w-4 h-4 text-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} SkySurfers Travel and Tours
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">

          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src={logo} alt="SkySurfers Travel and Tours" className="h-14 w-auto" />
          </div>

          <div className="flex bg-cloud-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                mode === 'login' ? 'bg-white text-sky-primary shadow-soft' : 'text-ink-secondary'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                mode === 'signup' ? 'bg-white text-sky-primary shadow-soft' : 'text-ink-secondary'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-ink-muted" />
                  <input
                    name="fullName" required placeholder="Full Name"
                    value={form.fullName} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-ink-muted" />
                  <input
                    name="contactNumber" required placeholder="Contact Number"
                    value={form.contactNumber} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-ink-muted" />
              <input
                type="email" name="email" required placeholder="Email"
                value={form.email} onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-ink-muted" />
              <input
                type="password" name="password" required placeholder="Password"
                value={form.password} onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary"
              />
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-ink-muted" />
                <input
                  type="password" name="confirmPassword" required placeholder="Confirm Password"
                  value={form.confirmPassword} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-sky-primary font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>
            )}

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-brand-red hover:bg-brand-redDeep text-white font-semibold text-sm transition-all shadow-soft disabled:opacity-60"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-cyan-pale" />
            <span className="text-xs text-ink-muted">or continue with</span>
            <div className="flex-1 h-px bg-cyan-pale" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-lg border border-cyan-pale text-sm font-medium text-ink-secondary hover:bg-cloud-50 transition-all"
          >
            Continue with Google
          </button>

          <p className="text-center text-xs text-ink-muted mt-8">
            Staff member?{' '}
            <Link to="/admin/login" className="text-sky-primary font-medium hover:underline">
              Sign in to the Staff Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}