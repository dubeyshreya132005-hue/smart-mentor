import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Eye, EyeOff, Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function InputField({ icon: Icon, type, placeholder, value, onChange, rightEl }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-dark-800 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
      />
      {rightEl && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-primary-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass rounded-2xl border border-slate-800/50 p-8 relative z-10">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <Bot className="w-7 h-7 text-primary-500" />
          <span className="text-lg font-bold text-white">MentorConnect <span className="text-primary-500">AI</span></span>
        </Link>

        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-sm text-slate-400 mb-8">Sign in to continue your learning journey</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange('email')}
          />
          <InputField
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={handleChange('password')}
            rightEl={
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-slate-400 hover:text-white transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Signing in…' : 'Sign In'}
            {!loading && <ChevronRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
