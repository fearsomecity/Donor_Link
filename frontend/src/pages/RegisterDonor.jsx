import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Droplet, ArrowRight, Heart } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { fetchAPI } from '../utils/apiClient';

export default function RegisterDonor() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bloodType: 'A+',
    zipCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetchAPI('/api/auth/register/donor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-neutral-50/50 dark:bg-[#0a0a0a]">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-crimson-100/50 rounded-full blur-[100px] animate-float dark:hidden dark:hidden" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-crimson-50/50 rounded-full blur-[100px] animate-float dark:hidden dark:hidden" style={{ animationDelay: '2s' }} />

      <div className="relative w-full max-w-lg glass p-10 rounded-[2.5rem] animate-fade-in-up mt-20 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-crimson-50 rounded-2xl mb-6 animate-pulse-slow">
            <Heart className="w-8 h-8 text-crimson-600 fill-crimson-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight mb-2 font-header">Become a Donor</h1>
          <p className="text-neutral-500 font-medium font-sans">Join thousands of others saving lives.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm dark:backdrop-blur-none text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in-up">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 ml-1">
              <User className="w-4 h-4 text-neutral-400 group-focus-within:text-crimson-500 transition-colors" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Jane Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 ml-1">
                <Droplet className="w-4 h-4 text-neutral-400 group-focus-within:text-crimson-500 transition-colors" />
                Blood Type
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="input-field appearance-none hover:border-crimson-200"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 group">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 ml-1">
                <MapPin className="w-4 h-4 text-neutral-400 group-focus-within:text-crimson-500 transition-colors" />
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                required
                value={formData.zipCode}
                onChange={handleChange}
                className="input-field"
                placeholder="12345"
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 ml-1">
              <Mail className="w-4 h-4 text-neutral-400 group-focus-within:text-crimson-500 transition-colors" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="jane@example.com"
            />
          </div>

          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 ml-1">
              <Lock className="w-4 h-4 text-neutral-400 group-focus-within:text-crimson-500 transition-colors" />
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-neutral-100 dark:border-[#2a2a2a] text-center">
          <p className="text-sm text-neutral-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-crimson-600 font-bold hover:text-crimson-700 hover:underline transition-all">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
