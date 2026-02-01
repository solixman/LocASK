"use client";

import Link from 'next/link';

interface NavbarProps {
  user?: { name?: string; email?: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Navbar({ user, onLoginClick, onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0f0f10]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Loc<span className="text-purple-600">ASK</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2 pl-2 py-1 pr-1 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-violet-600 flex items-center justify-center text-xs font-black text-white shadow-sm">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 hidden md:inline px-1">
                {user.name || user.email?.split('@')[0]}
              </span>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl text-sm font-black transition-all hover:bg-purple-600 dark:hover:bg-purple-50 hover:text-white dark:hover:text-purple-600 active:scale-95 shadow-lg shadow-black/5"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
