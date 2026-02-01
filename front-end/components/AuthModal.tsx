"use client";

import { useState } from 'react';
import { authService } from '@/services/api';
import { GoogleLogin } from '@react-oauth/google';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.googleLogin(credentialResponse.credential);
      onSuccess({
        ...(response.user || {}),
        email: response.user?.email,
        name: response.user?.name
      });
    } catch (err: any) {
      setError(err.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isLogin) {
        response = await authService.login({ email, password });
      } else {
        response = await authService.register({ email, password, name });
      }
      onSuccess({ 
        ...(response.user || {}), 
        email: response.user?.email || email, 
        name: response.user?.name || name 
      });
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#18191a] w-full max-w-md rounded-[3rem] p-8 sm:p-12 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-white/5 relative">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{isLogin ? 'Hello' : 'Welcome'}</h2>
            <div className="h-1.5 w-8 bg-purple-600 rounded-full mt-2"></div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-100 dark:border-rose-500/20 rounded-[1.5rem] text-rose-500 text-xs font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-7 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-purple-600/20 focus:bg-white dark:focus:bg-[#18191a] outline-none transition-all text-slate-900 dark:text-white font-bold text-sm tracking-wide placeholder:text-slate-300 uppercase"
              required
            />
          )}
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-7 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-purple-600/20 focus:bg-white dark:focus:bg-[#18191a] outline-none transition-all text-slate-900 dark:text-white font-bold text-sm tracking-wide placeholder:text-slate-300 uppercase"
            required
          />
          <input
            type="password"
            placeholder="SECRET PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-7 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-purple-600/20 focus:bg-white dark:focus:bg-[#18191a] outline-none transition-all text-slate-900 dark:text-white font-bold text-sm tracking-wide placeholder:text-slate-300 uppercase"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4.5 rounded-2xl transition-all hover:bg-purple-600 dark:hover:bg-purple-50 hover:text-white dark:hover:text-purple-600 active:scale-[0.98] disabled:opacity-50 mt-4 shadow-xl shadow-slate-200 dark:shadow-none uppercase tracking-widest text-xs"
          >
            {loading ? 'WAITING...' : (isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT')}
          </button>
        </form>

        <div className="my-10 flex items-center gap-4">
          <div className="h-0.5 flex-1 bg-slate-100 dark:bg-white/5"></div>
          <span className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">OR</span>
          <div className="h-0.5 flex-1 bg-slate-100 dark:bg-white/5"></div>
        </div>

        <div className="flex justify-center transform scale-110 active:scale-105 transition-transform overflow-hidden rounded-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            theme="filled_blue"
            shape="pill"
          />
        </div>

        <div className="mt-12 text-center">
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-400 hover:text-purple-600 font-black uppercase tracking-widest text-[10px] transition-colors"
            >
                {isLogin ? "DON'T HAVE AN ACCOUNT? SIGN UP" : "ALREADY A MEMBER? LOG IN"}
            </button>
        </div>
      </div>
    </div>
  );
}
