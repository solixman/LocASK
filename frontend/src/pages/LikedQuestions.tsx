import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { questionsApi, answersApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import HeartIcon from '../components/HeartIcon.tsx';
import type { Question, Answer } from '../types.ts';

const LikedQuestions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [likeError, setLikeError] = useState('');

  const defaultAvatar = 'https://imgs.search.brave.com/Z7xuZYK66Oj0scPZlFyhvvdIxu26npsASzDRHR4_3zI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8y/LzJjL0RlZmF1bHRf/cGZwLnN2Zw';

  const likedQuery = useQuery({
    queryKey: ['liked', user?.id],
    queryFn: () => questionsApi.getLiked(user!.id).then(res => res.data),
    enabled: !!user,
  });

  const filteredLiked = likedQuery.data ?? [];

  const answersQueries = useQueries({
    queries: filteredLiked.map(q => ({
      queryKey: ['answers', q.id],
      queryFn: () => answersApi.getByQuestion(q.id).then(res => res.data),
      enabled: expanded.has(q.id),
    }))
  });

  const toggleLike = useMutation({
    mutationFn: (questionId: string) => questionsApi.toggleLike(questionId, user!.id),
    onSuccess: () => {
      setLikeError('');
      queryClient.invalidateQueries({ queryKey: ['liked', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['likedByUser', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: () => {
      setLikeError('Unable to update like right now. Please try again.');
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ questionId, content }: { questionId: string; content: string }) => answersApi.create(questionId, { content, userId: user!.id }),
    onSuccess: (_, { questionId }) => {
      setAnswerTexts(prev => ({ ...prev, [questionId]: '' }));
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] });
    },
  });

  if (likedQuery.isLoading) {
    return <section className="page fullpage"><div className="empty-state">Loading liked questions...</div></section>;
  }

  return (
    <section className="page">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h1>❤️ Liked Questions</h1>
            <p>An archive of what you liked.</p>
          </div>
          <Link to="/" className="btn btn-secondary">📋 Back to Feed</Link>
        </div>

        {likedQuery.isError ? (
          <div className="alert alert-danger">Unable to load liked questions.</div>
        ) : !likedQuery.data?.length ? (
          <div className="alert alert-info">No liked questions yet.</div>
        ) : (
          <>
            {likeError && <div className="alert alert-danger">{likeError}</div>}
            <div className="grid">
              {filteredLiked.map((q: Question, index: number) => {
              const isExpanded = expanded.has(q.id);
              const answersQuery = answersQueries[index];

              return (
                <article key={q.id} className="card question-card">
                  <div className="question-card-top">
                    <div className="author-block">
                      <img src={q.user?.picture || defaultAvatar} alt={q.user?.name ?? 'Author'} className="author-avatar" />
                      <div className="author-info">
                        <span className="author-name">{q.user?.name || 'Unknown user'}</span>
                        <span className="author-meta">@{q.user?.name ? q.user.name.toLowerCase().replace(/\s+/g, '') : q.userId ? q.userId.slice(0, 8) : 'anon'}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="question-title">{q.title}</h3>
                  <p className="question-body">{q.content}</p>

                  <div className="question-card-footer">
                    <div className="footer-left">
                      <button
                        type="button"
                        className="btn-heart liked"
                        onClick={() => {
                          if (!user) {
                            setLikeError('Please sign in to like questions.');
                            return;
                          }
                          toggleLike.mutate(q.id);
                        }}
                        aria-label="Unlike question"
                        disabled={toggleLike.isPending}
                      >
                        <HeartIcon filled />
                        <span>Unlike</span>
                      </button>
                      <span className="small-text">{q.likesCount} likes</span>
                    </div>
                    <button
                      className="answers-toggle"
                      type="button"
                      onClick={() => setExpanded(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(q.id)) {
                          newSet.delete(q.id);
                        } else {
                          newSet.add(q.id);
                        }
                        return newSet;
                      })}
                      aria-label={answersQuery.data ? `${answersQuery.data.length} answers` : 'Answers'}
                    >
                      <span className="answers-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H7l-3 3V5z" />
                        </svg>
                      </span>
                      <span>{answersQuery.data ? `${answersQuery.data.length} Answers` : 'Answers'}</span>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="answer-panel">
                      <form className="form" onSubmit={(e) => {
                        e.preventDefault();
                        const content = answerTexts[q.id] || '';
                        if (content.trim()) {
                          answerMutation.mutate({ questionId: q.id, content });
                        }
                      }}>
                        <label>Your Answer</label>
                        <textarea 
                          value={answerTexts[q.id] || ''} 
                          onChange={e => setAnswerTexts(prev => ({ ...prev, [q.id]: e.target.value }))} 
                          rows={3} 
                          placeholder="Write your answer here..."
                          required 
                        />
                        <button className="btn btn-primary" type="submit" disabled={answerMutation.isPending}>
                          {answerMutation.isPending ? 'Posting...' : '✏️ Post Answer'}
                        </button>
                      </form>
                      <div style={{ marginTop: '1rem' }}>
                        <h4>Answers</h4>
                        {answersQuery.isLoading ? (
                          <div className="small-text">Loading answers...</div>
                        ) : answersQuery.error ? (
                          <div className="alert alert-danger">Failed to load answers.</div>
                        ) : answersQuery.data && answersQuery.data.length > 0 ? (
                          answersQuery.data.map((a: Answer) => (
                            <article key={a.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                              <p style={{ margin: 0 }}>{a.content}</p>
                              <small style={{ color: 'var(--muted)' }}>by {a.user?.name || 'anonymous'}</small>
                            </article>
                          ))
                        ) : (
                          <div className="small-text">No answers yet. Be the first!</div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LikedQuestions;
