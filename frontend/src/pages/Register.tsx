import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (credentials: { name: string; email: string; password: string }) => authApi.register(credentials),
    onSuccess: (response) => {
      login(response.data.user, response.data.access_token);
      navigate('/');
    },
    onError: (err: unknown) => {
      setError((err as any)?.response?.data?.message || 'Registration failed.');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    registerMutation.mutate(formData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="page fullpage">
      <div className="box">
        <h2>Create account</h2>
        <p>Start asking and answering questions in your local community</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>Full name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <button className="btn btn-primary" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="small-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
