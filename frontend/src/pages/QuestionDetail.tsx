import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi, answersApi } from '../api';
import { useAuth } from '../contexts/AuthContext';

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [answerText, setAnswerText] = useState('');

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionsApi.getAll().then(res => res.data),
  });
  const question = questions?.find((q: any) => q.id === id);

  const { data: answers, isLoading: answersLoading } = useQuery({
    queryKey: ['answers', id],
    queryFn: () => answersApi.getByQuestion(id!).then(res => res.data),
    enabled: !!id,
  });

  const answerMutation = useMutation({
    mutationFn: (content: string) => answersApi.create(id!, { content, userId: user!.id }),
    onSuccess: () => {
      setAnswerText('');
      queryClient.invalidateQueries({ queryKey: ['answers', id] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => questionsApi.toggleLike(id!, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] }),
  });

  if (questionsLoading || answersLoading) {
    return <section className="page fullpage"><div className="empty-state">Loading...</div></section>;
  }

  if (!question) {
    return <section className="page fullpage"><div className="empty-state"><h2>Question not found</h2><Link to="/" className="btn btn-secondary">Back to Home</Link></div></section>;
  }

  return (
    <section className="page">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h1>{question.title}</h1>
            <p>{question.content}</p>
            <div className="meta" style={{ paddingTop: '0.75rem', alignItems: 'center' }}>
              {question.user?.picture && (
                <img src={question.user.picture} alt={question.user.name ?? 'Author'} className="avatar" />
              )}
              <span className="small-text">Asked by: {question.user?.name || question.userId}</span>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => likeMutation.mutate()}>
            {question.isLiked ? 'Dislike' : 'Like'} {question.likesCount}
          </button>
        </div>

        <div className="form">
          <label>Write an answer</label>
          <textarea value={answerText} onChange={e => setAnswerText(e.target.value)} rows={4} />
          <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); answerMutation.mutate(answerText); }}>
            {answerMutation.isPending ? 'Posting...' : 'Post Answer'}
          </button>
        </div>

        <div className="spacer" />

        <section>
          <h2>Answers</h2>
          {(!answers || answers.length === 0) ? (
            <div className="alert alert-info">Be the first to answer this question.</div>
          ) : (
            answers.map((a: any) => (
              <article key={a.id} className="card">
                <p>{a.content}</p>
                <small>by {a.user?.name || 'anonymous'}</small>
              </article>
            ))
          )}
        </section>

        <Link to="/" className="text-link">? Back to questions</Link>
      </div>
    </section>
  );
};

export default QuestionDetail;
