import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Radio, Palette, Volume2, User as UserIcon, Shield, Menu, X, Home, Compass, ListMusic, Heart, Search } from 'lucide-react';
import { toggleThemeDrawer } from '../store/themeSlice';
import { toggleAmbienceModal } from '../store/ambienceSlice';
import { toggleAuthModal } from '../store/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { totalListeners } = useSelector((state) => state.radio);
  const { isHideUI } = useSelector((state) => state.ui);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isHideUI) return null;

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/radio', label: 'Radio', icon: Radio },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/playlists', label: 'Playlists', icon: ListMusic },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/search', label: 'Search', icon: Search }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 md:px-8 py-3.5 flex items-center justify-between glass-panel border-b border-borderCustom transition-all duration-500 bg-black/70 backdrop-blur-xl">
        {/* Left: Brand logo & Live Listener count badge */}
        <div className="flex items-center space-x-2 md:space-x-6 min-w-0 shrink">
          {/* 3-Line Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-black/50 border border-borderCustom text-accent hover:bg-accent hover:text-black transition-all flex items-center justify-center shrink-0"
            title="Toggle Menu"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center shrink-0 group">
            <img
              src="/app-logo.png"
              alt="NOSTALGIA FM"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 bg-black/30 p-1.5 rounded-full border border-borderCustom">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-accent text-black font-semibold shadow-lg shadow-accentGlow'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-1.5 md:space-x-3 shrink-0">
          {/* Theme Drawer Trigger */}
          <button
            onClick={() => dispatch(toggleThemeDrawer())}
            className="p-2 md:px-3 py-1.5 rounded-full bg-black/40 border border-borderCustom text-textSecondary hover:text-accent hover:border-accent transition-all text-xs flex items-center gap-1.5"
            title="Change Theme & Environment"
          >
            <Palette className="w-4 h-4 text-accent shrink-0" />
            <span className="hidden sm:inline font-medium text-[11px]">Theme</span>
          </button>

          {/* Ambient Mixer Trigger */}
          <button
            onClick={() => dispatch(toggleAmbienceModal())}
            className="p-2 md:px-3 py-1.5 rounded-full bg-black/40 border border-borderCustom text-textSecondary hover:text-accent hover:border-accent transition-all text-xs flex items-center gap-1.5"
            title="Ambient Sound Mixer"
          >
            <Volume2 className="w-4 h-4 text-accent shrink-0" />
            <span className="hidden sm:inline font-medium text-[11px]">Ambience</span>
          </button>

          {/* User / Admin Profile Button */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-1.5">
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="px-2.5 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-800/60 hover:bg-red-900 text-[11px] font-semibold flex items-center gap-1"
                  title="Admin Dashboard"
                >
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <Link
                to="/profile"
                className="flex items-center space-x-1.5 p-1 rounded-full bg-black/40 border border-borderCustom hover:border-accent transition-all"
                title="Profile & Music Collection"
              >
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.name || 'Profile'}
                  className="w-6 h-6 rounded-full object-cover border border-accent/60 shadow-sm"
                  onError={(e) => { e.target.src = '/default-avatar.png'; }}
                />
              </Link>
            </div>
          ) : (
            <button
              onClick={() => dispatch(toggleAuthModal('login'))}
              className="px-3.5 py-1.5 rounded-full bg-accent text-black font-semibold hover:bg-amber-400 transition-all text-xs shadow-md shadow-accentGlow"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Mobile 3-Line Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-2xl transition-all duration-300 animate-fadeIn">
          {/* Mobile Drawer Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-borderCustom">
            <div className="flex items-center space-x-2">
              <img src="/app-logo.png" alt="NOSTALGIA FM" className="h-9 w-auto object-contain" />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-white/10 text-textPrimary hover:text-accent transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <p className="text-[10px] font-mono text-textSecondary uppercase tracking-widest px-2">Navigation Menu</p>
            {navLinks.map((item) => {
              const IconComp = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl font-serif text-base transition-all ${
                    active
                      ? 'bg-accent text-black font-bold shadow-lg shadow-accentGlow'
                      : 'text-textPrimary bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <IconComp className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Admin link if user is admin */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl font-serif text-base text-red-300 bg-red-950/60 border border-red-800/60"
              >
                <Shield className="w-5 h-5 text-red-400 shrink-0" />
                <span>Admin Control Panel</span>
              </Link>
            )}

            {/* Quick Actions inside 3-Line Menu */}
            <div className="pt-4 border-t border-borderCustom space-y-2">
              <p className="text-[10px] font-mono text-textSecondary uppercase tracking-widest px-2">Quick Controls</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    dispatch(toggleThemeDrawer());
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-borderCustom flex items-center space-x-2 text-xs font-mono text-textPrimary"
                >
                  <Palette className="w-4 h-4 text-accent" />
                  <span>Theme</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    dispatch(toggleAmbienceModal());
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-borderCustom flex items-center space-x-2 text-xs font-mono text-textPrimary"
                >
                  <Volume2 className="w-4 h-4 text-accent" />
                  <span>Ambience</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
