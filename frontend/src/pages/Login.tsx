import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) => authApi.login(credentials),
    onSuccess: (response) => {
      login(response.data.user, response.data.access_token);
      navigate('/');
    },
    onError: (err: unknown) => {
      setError((err as any)?.response?.data?.message || 'Unable to login.');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    loginMutation.mutate(formData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="page fullpage">
      <div className="box">
        <h2>Sign in</h2>
        <p>Access your LocASK account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <button className="btn btn-primary" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="small-text">
          New to LocASK? <Link to="/register">Create account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
