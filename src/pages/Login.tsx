import { useState, FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold gradient-text">Nexora</h1>
          <p className="text-muted-foreground mt-2 text-sm">Connect with people you love</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white font-semibold py-3 rounded-lg text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mt-4 text-center">
          <p className="text-sm text-foreground/80">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
