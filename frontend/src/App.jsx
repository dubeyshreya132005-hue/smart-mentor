import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bot, Code, LineChart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MentorSearchPage from './pages/MentorSearchPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import CareerRoadmap from './pages/CareerRoadmap';
import AIAssistantPage from './pages/AIAssistantPage';
import SandboxPage from './pages/SandboxPage';
import AchievementsPage from './pages/AchievementsPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import SmartCompareResumePage from './pages/SmartCompareResumePage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen mesh-bg overflow-hidden relative">

      {/* Animated background orbs */}
      <div className="absolute top-[-8%] left-[-5%] w-[480px] h-[480px] rounded-full orb-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.5) 0%, rgba(52,211,153,0.2) 50%, transparent 70%)' }} />
      <div className="absolute top-[20%] right-[-8%] w-[360px] h-[360px] rounded-full orb-float-2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,243,208,0.45) 0%, rgba(110,231,183,0.15) 50%, transparent 70%)' }} />
      <div className="absolute bottom-[5%] left-[10%] w-[300px] h-[300px] rounded-full orb-pulse pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(187,247,208,0.4) 0%, transparent 65%)' }} />
      <div className="absolute bottom-[-5%] right-[5%] w-[420px] h-[420px] rounded-full orb-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.35) 0%, transparent 65%)' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,1) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Navbar */}
      <nav className="navbar-glass sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl btn-glow flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800">
            MentorConnect <span className="gradient-text">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">Features</a>
          <a href="#how" className="text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">How it Works</a>
          {user ? (
            <Link to="/dashboard" className="btn-glow px-5 py-2.5 text-sm font-semibold text-white rounded-xl">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Log in</Link>
              <Link to="/signup" className="btn-glow px-5 py-2.5 text-sm font-semibold text-white rounded-xl">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative z-10">
        <div className="text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full badge-pill mb-10">
            <span className="flex w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-sm shadow-primary-400" />
            <span className="text-xs font-semibold text-primary-700 tracking-wide">v1.0 — Now in Beta · 1,000+ learners joined</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-[5.5rem] font-extrabold tracking-tight mb-7 leading-[1.08] text-slate-900">
            Your AI-Powered<br />
            <span className="gradient-text drop-shadow-sm">Career Companion</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Bridge the gap between where you are and your dream job. Personalized AI mentoring,
            live coding collaboration, and an intelligent career roadmap — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-20">
            <Link to="/signup" className="btn-glow px-9 py-4 text-base font-bold text-white rounded-2xl hover:scale-105 active:scale-95 transition-transform">
              Start for Free →
            </Link>
            <a href="#features" className="px-9 py-4 text-base font-bold text-slate-700 glass-card rounded-2xl hover:border-primary-200 hover:text-primary-700 transition-all">
              See Features
            </a>
          </div>

          {/* Floating mini cards */}
          <div className="relative flex justify-center gap-4 flex-wrap mb-6 pointer-events-none select-none">
            {[
              { emoji: '🚀', text: 'AI Roadmap', color: 'from-green-50 to-emerald-50', border: 'border-green-200' },
              { emoji: '💬', text: 'Live Mentor Chat', color: 'from-teal-50 to-green-50', border: 'border-teal-200' },
              { emoji: '📄', text: 'Resume AI', color: 'from-emerald-50 to-teal-50', border: 'border-emerald-200' },
              { emoji: '🖥️', text: 'Code Sandbox', color: 'from-green-50 to-lime-50', border: 'border-green-200' },
            ].map(({ emoji, text, color, border }) => (
              <div key={text} className={`bg-gradient-to-br ${color} border ${border} rounded-2xl px-5 py-3 flex items-center gap-2.5 shadow-sm`}>
                <span className="text-xl">{emoji}</span>
                <span className="text-sm font-semibold text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div id="features" className="mt-28 grid md:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: Bot,
              gradient: 'from-green-500 to-emerald-500',
              bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
              border: 'border-green-100',
              title: 'AI Persona Assistant',
              desc: 'Adaptive mentoring tailored to your style. Get instant doubt resolution, mock interviews, and motivational guidance.',
              tag: 'AI-Powered',
            },
            {
              icon: Code,
              gradient: 'from-emerald-500 to-teal-500',
              bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
              border: 'border-emerald-100',
              title: 'Live Coding Sandbox',
              desc: 'Collaborate with mentors in real-time. Run code instantly, get AI reviews, and crack technical interviews.',
              tag: 'Real-time',
            },
            {
              icon: LineChart,
              gradient: 'from-teal-500 to-cyan-500',
              bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
              border: 'border-teal-100',
              title: 'Career GPS',
              desc: 'Visualize your path. Identify skill gaps, track milestones with heatmaps, and become job-ready faster.',
              tag: 'Smart Insights',
            },
          ].map(({ icon: Icon, gradient, bg, border, title, desc, tag }) => (
            <div key={title} className={`feature-card rounded-3xl p-8 group`}>
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${bg} border ${border} text-slate-600`}>{tag}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              <div className="mt-6 flex items-center gap-1 text-primary-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-20 grid grid-cols-3 gap-6">
          {[
            { value: '1,200+', label: 'Active Learners', icon: '👩‍💻' },
            { value: '150+', label: 'Expert Mentors', icon: '🎓' },
            { value: '95%', label: 'Job Placement Rate', icon: '🚀' },
          ].map(({ value, label, icon }, i) => (
            <div key={label} className="glass-card rounded-3xl p-8 text-center stat-animate" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="text-3xl mb-3">{icon}</div>
              <p className="text-4xl font-extrabold gradient-text mb-2">{value}</p>
              <p className="text-sm font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-10 border-t border-primary-100/60 text-sm text-slate-400 font-medium">
        © 2024 MentorConnect AI · Built with ❤️ for learners everywhere
      </footer>
    </div>
  );
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/mentors" element={<ProtectedRoute><MentorSearchPage /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><div className="p-8 text-slate-800 min-h-screen bg-transparent">Sessions — Phase 3</div></ProtectedRoute>} />
          <Route path="/sandbox" element={<ProtectedRoute><SandboxPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
          <Route path="/career-gps" element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
          <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
          <Route path="/smart-compare" element={<ProtectedRoute><SmartCompareResumePage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
