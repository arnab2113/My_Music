import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Radio, Mail, Lock, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { setUser } from '../store/authSlice';
import { addToast } from '../store/uiSlice';
import api from '../services/api';

export default function AuthLandingPage() {
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await api.post(endpoint, payload);

      dispatch(setUser(res.data));
      dispatch(addToast({ message: isLogin ? 'Welcome back to Nostalgia FM!' : 'Account created successfully!', type: 'success' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-black text-white flex items-center justify-center lg:justify-end p-4 md:p-8 lg:pr-16 overflow-hidden select-none">
      {/* Real Full Background Artwork Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('/auth-bg.jpg')` }}
      />

      {/* Dark Ambient Overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/40 via-black/30 to-black/80" />

      {/* Right-aligned Sleek Glassmorphic Form Card overlay matching Image 2 */}
      <div className="relative z-10 w-full max-w-md">
        <div className="p-6 sm:p-8 rounded-3xl bg-black/75 border border-pink-500/30 backdrop-blur-xl shadow-2xl shadow-pink-950/60 space-y-5 relative overflow-hidden">
          
          {/* Subtle Top Glowing Line inside Card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_15px_#ec4899]" />

          {/* Header Branding */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-pink-950/60 border border-pink-500/40 text-pink-400 shadow-lg shadow-pink-900/40 mb-1">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>

            <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
              NOSTALGIA <span className="text-pink-500">FM</span>
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
              ───── MUSIC NEVER GETS OLD ─────
            </p>

            <h3 className="font-serif font-bold text-xl text-white pt-2">
              {isLogin ? (
                <>Welcome <span className="text-pink-400">Back!</span></>
              ) : (
                <>Create <span className="text-pink-400">Account</span></>
              )}
            </h3>
            <p className="text-xs text-stone-400 font-sans">
              {isLogin ? 'Sign in to continue your nostalgic journey' : 'Register to start listening to 90s classics'}
            </p>
          </div>

          {/* Error Prompt */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono text-center animate-shake">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => dispatch(addToast({ message: 'Please contact administrator or support to reset your password.', type: 'info' }))}
                  className="text-[11px] font-sans text-pink-400 hover:text-pink-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Main Submit Button matching Image 2 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-600/40 hover:shadow-pink-600/60 hover:scale-[1.01] active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login / Register Footer */}
          <div className="text-center text-xs text-stone-400 font-sans pt-1">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className="text-pink-400 font-bold hover:underline ml-1"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className="text-pink-400 font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
