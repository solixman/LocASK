"use client";

import { useState } from 'react';
import { questionsService, answersService } from '@/services/api';

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    likes: any;
    likesCount?: number;
    createdAt: string;
    author?: { name: string };
  };
  userId?: string;
}

export default function QuestionCard({ question, userId }: QuestionCardProps) {
  const initialLikesCount = typeof question.likes === 'number' ? question.likes : (question.likesCount ?? (Array.isArray(question.likes) ? question.likes.length : 0));
  const [likes, setLikes] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(
    Array.isArray(question.likes) && userId 
      ? question.likes.some((l: any) => l.userId === userId) 
      : false
  );
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!userId) {
      alert("Please login to like");
      return;
    }
    setIsLiking(true);
    try {
      const response = await questionsService.toggleLike(question.id, userId);
      if (response.liked) {
        setLikes(prev => prev + 1);
        setIsLiked(true);
      } else {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');

  const fetchAnswers = async () => {
    setLoadingAnswers(true);
    try {
      const data = await answersService.getAnswersByQuestion(question.id);
      setAnswers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnswers(false);
    }
  };

  const handleToggleAnswers = () => {
    if (!showAnswers) fetchAnswers();
    setShowAnswers(!showAnswers);
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newAnswer) return;
    try {
      await answersService.createAnswer(question.id, { content: newAnswer, userId });
      setNewAnswer('');
      fetchAnswers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-[#18191a] rounded-[2.5rem] p-7 sm:p-9 border border-slate-100 dark:border-white/5 shadow-sm transition-all hover:shadow-xl hover:shadow-purple-500/5 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-xl shadow-inner font-black text-slate-300 dark:text-slate-600">
                {(question.author?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight pr-4">{question.title}</h3>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">
                    {question.author?.name || 'Anonymous'}
                </p>
            </div>
        </div>
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed text-base font-medium flex-grow">{question.content}</p>
      
      <div className="flex items-center gap-2 pt-6 border-t border-slate-50 dark:border-white/5 mt-auto">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${
            isLiked 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
              : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span>{likes}</span>
        </button>
        
        <button 
          onClick={handleToggleAnswers}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${
            showAnswers 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
              : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-purple-600 hover:bg-purple-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <span>Answers</span>
        </button>
      </div>

      {showAnswers && (
        <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 space-y-4">
          {loadingAnswers ? (
            <div className="text-center py-4">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-3">
                {answers.map((ans: any) => (
                  <div key={ans.id} className="bg-slate-50 dark:bg-white/5 p-5 rounded-3xl">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{ans.content}</p>
                    <span className="text-[10px] font-black italic text-purple-600/70 mt-3 block uppercase tracking-widest">
                        {ans.author?.name || 'Helper'}
                    </span>
                  </div>
                ))}
              </div>
              
              {userId ? (
                <form onSubmit={handlePostAnswer} className="flex gap-2 pt-2">
                  <input 
                    type="text" 
                    placeholder="Lend a hand..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <button type="submit" className="bg-purple-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl text-xs font-black shadow-lg shadow-purple-500/20 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </form>
              ) : (
                <p className="text-[10px] font-black text-center text-slate-400 uppercase tracking-widest py-2 italic">
                    Identify yourself to contribute
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
