"use client";

import { useState } from 'react';
import { questionsService } from '@/services/api';

interface AskQuestionFormProps {
  onSuccess: () => void;
  userId: string;
  location: { lat: number; lng: number };
}

export default function AskQuestionForm({ onSuccess, userId, location }: AskQuestionFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      await questionsService.createQuestion({
        title,
        content,
        userId,
        latitude: location.lat,
        longitude: location.lng
      });
      setTitle('');
      setContent('');
      onSuccess();
    } catch (err: any) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#18191a] rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Ask Locals</h2>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="BRIEF SUMMARY"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-7 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-purple-600/20 focus:bg-white dark:focus:bg-[#18191a] outline-none transition-all text-slate-900 dark:text-white font-bold text-sm uppercase placeholder:text-slate-300"
          required
        />
        <textarea
          placeholder="WHAT'S THE DETAIL?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-7 py-5 rounded-[2rem] bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-purple-600/20 focus:bg-white dark:focus:bg-[#18191a] outline-none transition-all min-h-[140px] text-slate-900 dark:text-white font-medium text-sm lg:text-base placeholder:text-slate-300 no-scrollbar"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white font-black py-4.5 rounded-[2rem] transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-xs mt-2 shadow-lg shadow-purple-500/20"
        >
          {isSubmitting ? 'SENDING...' : 'PUBLISH'}
        </button>
      </div>
    </form>
  );
}
