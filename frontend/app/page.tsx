"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import AskQuestionForm from "@/components/AskQuestionForm";
import AuthModal from "@/components/AuthModal";
import { questionsService } from "@/services/api";

type ViewType = 'recent' | 'trending' | 'liked';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [location, setLocation] = useState({ lat: 34.0522, lng: -118.2437 }); // Default to LA
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewType>('recent');
  const [showMobileForm, setShowMobileForm] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log("Geolocation error:", error)
      );
    }
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let data;
      if (view === 'liked') {
        if (!user) {
          setAuthMode('login');
          setView('recent');
          return;
        }
        data = await questionsService.getLikedQuestions(location.lat, location.lng, user.id);
      } else {
        data = await questionsService.getQuestions(location.lat, location.lng);
      }
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [location, view, user]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    setView('recent');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f0f10] font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar 
        user={user} 
        onLoginClick={() => setAuthMode('login')} 
        onLogout={handleLogout}
        onAskClick={() => user ? setShowMobileForm(true) : setAuthMode('login')}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        
        {/* Navigation Sidebar - Always on Left for Desktop, Horizontal on Mobile */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <div className="lg:sticky lg:top-28">
            <div className="flex lg:flex-col gap-2 p-1.5 bg-white dark:bg-[#18191a] rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setView('recent')}
                className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2.5 px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all font-bold text-sm whitespace-nowrap ${view === 'recent' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
                Feed
              </button>
              <button 
                onClick={() => setView('liked')}
                className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2.5 px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all font-bold text-sm whitespace-nowrap ${view === 'liked' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Saved
              </button>
            </div>
          </div>
        </div>

        {/* Main Feed Content */}
        <div className="lg:col-span-9 space-y-6 sm:space-y-8">
          <div className="flex items-end justify-between px-2">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                {view === 'recent' ? 'Local Stream' : 'Your Collection'}
              </h1>
              <div className="h-1.5 w-12 bg-purple-600 rounded-full mt-2"></div>
            </div>
            
          </div>

          {loading ? (
            <div className="space-y-4 sm:space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-56 bg-white dark:bg-[#18191a] rounded-[2rem] border border-slate-50 dark:border-white/5 animate-pulse"></div>
              ))}
            </div>
          ) : questions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
              {questions.map((q: any) => (
                <QuestionCard key={q.id} question={q} userId={user?.id} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white dark:bg-[#18191a] rounded-[2.5rem] border border-slate-50 dark:border-white/5">
              <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-4xl mb-6">🏜️</div>
              <h3 className="text-xl font-extrabold text-slate-400">Nothing to see here yet</h3>
              <p className="text-sm text-slate-400 mt-2">Start a conversation in your neighborhood!</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Form Modal */}
      {showMobileForm && user && (
        <div className="fixed inset-0 z-[100] animate-slide-up bg-white/50 dark:bg-black/80 backdrop-blur-md p-4 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="flex justify-end mb-4">
                    <button onClick={() => setShowMobileForm(false)} className="w-12 h-12 bg-white dark:bg-[#18191a] rounded-2xl flex items-center justify-center shadow-2xl border border-slate-100 dark:border-white/5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <AskQuestionForm userId={user.id} location={location} onSuccess={() => { fetchQuestions(); setShowMobileForm(false); }} />
            </div>
        </div>
      )}

      {authMode && (
        <AuthModal 
          onClose={() => setAuthMode(null)} 
          initialMode={authMode}
          onSuccess={(u) => {
            setUser(u);
            setAuthMode(null);
          }} 
        />
      )}
    </div>
  );
}
