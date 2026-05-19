import { useState, FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';

export function Register() {
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold gradient-text">Nexora</h1>
          <p className="text-muted-foreground mt-2 text-sm">Join the community today</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white font-semibold py-3 rounded-lg text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mt-4 text-center">
          <p className="text-sm text-foreground/80">
            Have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
