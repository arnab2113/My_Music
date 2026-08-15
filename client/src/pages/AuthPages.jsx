import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Lock, Mail, User as UserIcon, Radio } from 'lucide-react';
import { toggleAuthModal, setUser } from '../store/authSlice';
import { addToast } from '../store/uiSlice';
import api from '../services/api';

export default function AuthPages() {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalMode } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(authModalMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await api.post(endpoint, payload);
      dispatch(setUser(res.data));
      dispatch(toggleAuthModal());
      dispatch(addToast({ message: isLogin ? 'Welcome back!' : 'Account registered successfully!', type: 'success' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-borderCustom p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-borderCustom">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-accent animate-pulse" />
            <h2 className="font-serif font-bold text-xl text-textPrimary">
              {isLogin ? 'Sign In to Nostalgia FM' : 'Join Nostalgia FM'}
            </h2>
          </div>
          <button onClick={() => dispatch(toggleAuthModal())} className="p-1.5 rounded-full text-textSecondary hover:text-textPrimary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <p className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-mono uppercase text-textSecondary mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-sm text-textPrimary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-textSecondary mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@nostalgiafm.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-sm text-textPrimary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-textSecondary mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-borderCustom text-sm text-textPrimary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-accent text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-accentGlow mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-textSecondary font-sans">
          {isLogin ? "Don't have an account? " : 'Already registered? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-accent font-bold underline ml-1">
            {isLogin ? 'Register now' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
