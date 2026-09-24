import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/branding/logo.png';
import NotificationBell from './NotificationBell';




export default function Navbar() {

  const { user, profile, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-cyan-pale sticky top-0 z-40 shadow-soft">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2">

            <img src={logo} alt="SkySurfers Travel and Tours" className="h-11 w-auto"/>
            
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-secondary">

            <Link to="/" className="hover:text-sky-primary transition-colors">Explore</Link>

            <Link to="/packages" className="hover:text-sky-primary transition-colors">Packages</Link>

            <Link to="/trip-matcher" className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 transition-colors font-semibold">

              <Sparkles className="w-4 h-4" />

              Find My Trip

            </Link>

          </div>

          <div className="flex items-center gap-4">

             {user ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                <Link

                  to={profile?.role === 'customer' ? '/dashboard' : '/admin/dashboard'}

                  className="flex items-center gap-2 text-sm bg-cloud-100 hover:bg-cloud-200 px-3 py-1.5 rounded-lg border border-cyan-pale text-navy-main transition-all"
                >
                  <User className="w-4 h-4 text-sky-primary" />

                  <span>{profile?.full_name || 'Account'}</span>

                </Link>

                <button

                  onClick={signOut}

                  className="p-1.5 text-ink-muted hover:text-brand-red transition-colors"

                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />

                </button>

              </div>

            ) : (
              <button

                onClick={() => navigate('/login')}

                className="text-sm px-4 py-2 rounded-lg bg-brand-red hover:bg-brand-redDeep text-white font-semibold transition-all shadow-soft"
              >
                Sign In

              </button>

            )}

          </div>

        </div>

      </div>

    </nav>

  );
  
}