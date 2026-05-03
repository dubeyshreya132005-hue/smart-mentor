import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Eye, EyeOff, Mail, Lock, User, ChevronRight, AlertCircle, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
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

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
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
      <div className="hidden lg:flex w-5/12 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #bbf7d0 0%, #6ee7b7 50%, #34d399 100%)' }}>
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 rounded-full orb-float opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)' }} />
        <div className="absolute bottom-[-8%] left-[-5%] w-64 h-64 rounded-full orb-float-2 opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)' }} />

        <div className="relative z-10 px-12 text-center">
          <div className="text-6xl mb-6">🎓</div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Start your career<br />transformation
          </h2>
          <p className="text-emerald-100 font-medium leading-relaxed mb-8">
            Join thousands of learners who landed their dream jobs with AI-powered guidance.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { num: '1,200+', label: 'Active Learners' },
              { num: '95%', label: 'Job Placement Rate' },
              { num: '150+', label: 'Expert Mentors' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3.5 border border-white/30 flex items-center justify-between">
                <span className="text-2xl font-extrabold text-white">{num}</span>
                <span className="text-emerald-100 font-medium text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 rounded-full orb-pulse pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.25), transparent 70%)' }} />

        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl btn-glow flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">
              MentorConnect <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="mb-7">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create account</h1>
            <p className="text-slate-500 font-medium">Join thousands of learners today — it's free</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-3 mb-6">
            {[
              { key: 'student', label: 'I\'m a Student', icon: GraduationCap },
              { key: 'mentor', label: 'I\'m a Mentor', icon: Briefcase },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: key }))}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                  form.role === key
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-200'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <InputField id="name" icon={User} type="text" placeholder="Full Name" value={form.name} onChange={handleChange('name')} />
            <InputField id="email" icon={Mail} type="email" placeholder="Email Address" value={form.email} onChange={handleChange('email')} />
            <InputField
              id="password"
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 chars)"
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
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating account…</span>
              ) : (
                <><Sparkles className="w-4 h-4" />Create Account<ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-7 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-bold transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
