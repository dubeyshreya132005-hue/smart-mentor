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

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold tracking-tight text-white">MentorConnect <span className="text-primary-500">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#how" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</a>
          {user ? (
            <Link to="/dashboard" className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/30">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</Link>
              <Link to="/signup" className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/30">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary-500/30 mb-8">
          <span className="flex w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-xs font-medium text-primary-200">v1.0 — Now in Beta · 1000+ learners joined</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Your AI-Powered <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-400 to-purple-400">
            Career Companion
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Bridge the gap between where you are and your dream job. Personalized AI mentoring, live coding collaboration, and an intelligent career roadmap — all in one place.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/signup" className="px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95">
            Start for Free →
          </Link>
          <a href="#features" className="px-8 py-4 text-base font-semibold text-slate-300 glass rounded-xl hover:bg-slate-800 hover:text-white transition-all">
            See Features
          </a>
        </div>

        {/* Feature Cards */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: Bot, color: 'bg-primary-500/10 text-primary-400',
              title: 'AI Persona Assistant',
              desc: 'Adaptive mentoring tailored to your style. Get instant doubt resolution, mock interviews, and motivational guidance.',
            },
            {
              icon: Code, color: 'bg-blue-500/10 text-blue-400',
              title: 'Live Coding Sandbox',
              desc: 'Collaborate with mentors in real-time. Run code instantly, get AI reviews, and crack technical interviews.',
            },
            {
              icon: LineChart, color: 'bg-purple-500/10 text-purple-400',
              title: 'Career GPS',
              desc: 'Visualize your path. Identify skill gaps, track milestones with heatmaps, and become job-ready faster.',
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass p-8 rounded-2xl border border-slate-800/50 hover:border-slate-600/50 transition-all group">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-20 grid grid-cols-3 gap-6">
          {[
            { value: '1,200+', label: 'Active Learners' },
            { value: '150+', label: 'Expert Mentors' },
            { value: '95%', label: 'Job Placement Rate' },
          ].map(({ value, label }) => (
            <div key={label} className="glass border border-slate-800/50 rounded-2xl p-6">
              <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400 mb-1">{value}</p>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 border-t border-slate-800/50 text-sm text-slate-500">
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
          <Route path="/sessions" element={<ProtectedRoute><div className="p-8 text-white bg-dark-900 min-h-screen">Sessions — Phase 3</div></ProtectedRoute>} />
          <Route path="/sandbox" element={<ProtectedRoute><SandboxPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
          <Route path="/career-gps" element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
