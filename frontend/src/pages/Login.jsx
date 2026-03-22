import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Heart } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('🚀 Login attempt started for:', email);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      console.log('📡 Fetching /api/auth/login...');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('📥 Response received, status:', res.status);
      
      const data = await res.json();
      console.log('📄 Data parsed:', data);
      
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      console.log('✅ Login successful!');
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      console.error('❌ Login error:', err.name === 'AbortError' ? 'Timeout reaching server' : err.message);
      setError(err.name === 'AbortError' ? 'Server timeout. Please check your connection.' : err.message);
    } finally {
      setLoading(false);
      console.log('🏁 Login attempt finished.');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-6 overflow-hidden bg-neutral-50/50">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-crimson-100/50 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-crimson-50/50 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative w-full max-w-lg glass p-10 rounded-[2rem] animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-crimson-50 rounded-2xl mb-6 animate-pulse-slow">
            <Heart className="w-8 h-8 text-crimson-600 fill-crimson-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-neutral-500 font-medium font-sans">Log in to your DonorNet account.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in-up">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 ml-1">
              <Mail className="w-4 h-4 text-neutral-400 group-focus-within:text-crimson-500 transition-colors" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2 group">
            <div className="flex items-center justify-between ml-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <Lock className="w-4 h-4 text-neutral-400 group-focus-within:text-crimson-500 transition-colors" />
                Password
              </label>
              <a href="#" className="text-xs text-crimson-600 font-bold hover:text-crimson-700 transition-colors">Forgot password?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full group overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-neutral-100 text-center">
          <p className="text-sm text-neutral-500 font-medium">
            Don't have an account?
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link to="/register/donor" className="px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center gap-2">
              Join as Donor
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link to="/register/hospital" className="px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center gap-2">
              Join as Hospital
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
