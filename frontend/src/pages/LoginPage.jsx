import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Eye, EyeOff, Mail, Lock, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function InputField({ icon: Icon, type, placeholder, value, onChange, rightEl, id }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors z-10">
        <Icon className="w-4 h-4" />
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full input-field rounded-2xl py-4 pl-11 pr-12 text-sm text-slate-800 placeholder-slate-400 font-medium"
      />
      {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{rightEl}</div>}
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
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)' }}>

      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #dcfce7 0%, #bbf7d0 40%, #6ee7b7 100%)' }}>
        {/* Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 rounded-full orb-float opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%)' }} />
        <div className="absolute bottom-[-5%] right-[-5%] w-64 h-64 rounded-full orb-float-2 opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-10 px-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/50">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Welcome back to<br />your journey
          </h2>
          <p className="text-emerald-100 text-lg font-medium leading-relaxed mb-10">
            Your AI career companion is ready to guide you to your dream job.
          </p>
          <div className="flex flex-col gap-4">
            {[
              { emoji: '🚀', text: 'Personalized AI roadmaps' },
              { emoji: '💡', text: 'Live mentor sessions' },
              { emoji: '📈', text: 'Resume ATS scoring' },
            ].map(({ emoji, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3.5 border border-white/30">
                <span className="text-2xl">{emoji}</span>
                <span className="text-white font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Background orbs */}
        <div className="absolute top-[-15%] right-[-10%] w-72 h-72 rounded-full orb-pulse pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.3), transparent 70%)' }} />

        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl btn-glow flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">
              MentorConnect <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Sign in</h1>
            <p className="text-slate-500 font-medium">Continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="email"
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange('email')}
            />
            <InputField
              id="password"
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange('password')}
              rightEl={
                <button type="button" onClick={() => setShowPassword((s) => !s)}
                  className="text-slate-400 hover:text-primary-600 transition-colors p-1">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {error && (
              <div className="flex items-center gap-2.5 text-red-600 text-sm bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl disabled:opacity-60 mt-2 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in…</span>
              ) : (
                <><Sparkles className="w-4 h-4" />Sign In<ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-500 font-bold transition-colors">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
