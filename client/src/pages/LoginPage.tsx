import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../lib/api';

export const LoginPage = () => {
  const user = useAuthStore((state) => state.user);
  const signIn = useAuthStore((state) => state.signIn);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center py-6">
      <div className="card w-full max-w-md bg-base-100 shadow-md">
        <form className="card-body gap-4" onSubmit={handleSubmit}>
          <h1 className="card-title text-2xl">Welcome back</h1>
          <p className="text-sm text-base-content/60">Log in to write and manage your posts.</p>

          {error && <div className="alert alert-error text-sm">{error}</div>}

          <label className="input input-bordered flex w-full items-center gap-2">
            <Mail className="size-4 opacity-60" />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <div className="input input-bordered flex w-full items-center gap-2">
            <KeyRound className="size-4 opacity-60" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="grow"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="cursor-pointer text-base-content/60 hover:text-primary"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>

          <button className="btn btn-primary mt-2" type="submit" disabled={submitting}>
            {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Log in'}
          </button>

          <p className="text-center text-sm">
            New here?{' '}
            <Link to="/register" className="link link-primary">
              Create an account
            </Link>
          </p>

          <div className="alert alert-info text-xs">
            Demo: <strong>demo@blog.test</strong> / <strong>password123</strong> (after seeding)
          </div>
        </form>
      </div>
    </div>
  );
};
