import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bot, Code, LineChart, BookOpen, Calendar, MessageSquare,
  Trophy, Flame, Target, TrendingUp, LogOut, User, Zap, FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="glass border border-slate-800/50 rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
        {sub && <p className="text-xs text-primary-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SkillBar({ skill, level, color }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{skill}</span>
        <span className="text-slate-500">{level}%</span>
      </div>
      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        active ? 'bg-primary-600/20 text-primary-400' : 'text-slate-400 hover:bg-dark-700 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?.role === 'mentor') {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/mentors/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBooking = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/mentors/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userSkills = user?.skills || [];
  // For mentors, expertise is used as skills in dashboard view
  const displaySkills = user?.role === 'mentor' ? (user.expertise || []) : userSkills;

  const skillsData = displaySkills.map((s, idx) => ({
    skill: s,
    level: Math.max(30, 100 - (idx * 15)), // Mocking levels for now based on index
    color: ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][idx % 4]
  }));

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 glass border-r border-slate-800/50 flex flex-col p-4 gap-1">
        <Link to="/" className="flex items-center gap-2 px-3 py-3 mb-4">
          <Bot className="w-6 h-6 text-primary-500" />
          <span className="font-bold text-white">MentorConnect <span className="text-primary-500">AI</span></span>
        </Link>

        <NavItem icon={LineChart} label="Dashboard" to="/dashboard" active />
        <NavItem icon={User} label="My Profile" to="/profile" />
        <NavItem icon={Bot} label="AI Assistant" to="/ai-assistant" />
        <NavItem icon={FileText} label="Resume Analyzer" to="/resume-analyzer" />
        {user?.role !== 'mentor' && <NavItem icon={BookOpen} label="Mentors" to="/mentors" />}
        <NavItem icon={Calendar} label="Sessions" to="/sessions" />
        <NavItem icon={Code} label="Code Sandbox" to="/sandbox" />
        <NavItem icon={MessageSquare} label="Messages" to="/messages" />
        <NavItem icon={Trophy} label="Achievements" to="/achievements" />

        <div className="mt-auto">
          <div className="glass border border-slate-700/30 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-blue-500 w-[65%]" />
            </div>
            <p className="text-xs text-slate-400 mt-1">650 / 1000 XP</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-orange-400 font-medium">7 Day Streak 🔥</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's your learning overview for today.</p>
        </div>

        {/* Stats */}
        {user?.role === 'mentor' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Target} label="Total Earnings" value={`$${(user?.totalSessions || 0) * (user?.hourlyRate || 0)}`} color="bg-green-500/10 text-green-400" sub="All time" />
            <StatCard icon={Trophy} label="Rating" value={`${user?.rating || 5.0} ⭐`} color="bg-yellow-500/10 text-yellow-400" sub="From 12 reviews" />
            <StatCard icon={Calendar} label="Sessions Completed" value={user?.totalSessions || 0} color="bg-blue-500/10 text-blue-400" sub="Great job!" />
            <StatCard icon={User} label="Profile Views" value={user?.xp || 42} color="bg-purple-500/10 text-purple-400" sub="This week" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Trophy} label="XP Points" value={user?.xp || 0} color="bg-yellow-500/10 text-yellow-400" sub="+120 this week" />
            <StatCard icon={Target} label="Skill Score" value={`${user?.confidenceMeter || 50}%`} color="bg-primary-500/10 text-primary-400" sub="↑ 8% from last week" />
            <StatCard icon={Calendar} label="Sessions Done" value={user?.totalSessions || 0} color="bg-blue-500/10 text-blue-400" sub="Next: Tomorrow 3PM" />
            <StatCard icon={Zap} label="Streak" value={`${user?.streak || 0} Days`} color="bg-purple-500/10 text-purple-400" sub="Keep it up!" />
          </div>
        )}

        {user?.role === 'mentor' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass border border-slate-800/50 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">Upcoming Sessions & Requests</h2>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b._id} className="flex items-center justify-between p-4 bg-dark-800 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold text-white">
                          {b.student?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{b.student?.name}</p>
                          <p className="text-xs text-slate-400">{new Date(b.date).toLocaleDateString()} at {b.slot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          b.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                          'bg-slate-500/10 text-slate-400'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateBooking(b._id, 'accepted')} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-lg transition-all">Accept</button>
                            <button onClick={() => handleUpdateBooking(b._id, 'rejected')} className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold rounded-lg transition-all">Reject</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic mb-6 text-center py-4">No requests or upcoming sessions. Make sure your availability is up to date.</p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="glass border border-slate-800/50 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { icon: User, label: 'Edit Profile', to: '/profile', color: 'text-primary-400 bg-primary-500/10' },
                    { icon: Calendar, label: 'Update Availability', to: '/profile', color: 'text-blue-400 bg-blue-500/10' },
                    { icon: MessageSquare, label: 'Messages', to: '/messages', color: 'text-purple-400 bg-purple-500/10' },
                  ].map(({ icon: Icon, label, to, color }) => (
                    <Link key={label} to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 transition-all group">
                      <span className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Skill Heatmap */}
            <div className="lg:col-span-2 glass border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Skill Heatmap</h2>
                <Link to="/career-gps" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">View Career GPS →</Link>
              </div>
              {skillsData.length > 0 ? (
                skillsData.map((s) => <SkillBar key={s.skill} {...s} />)
              ) : (
                <p className="text-slate-500 text-sm italic mb-6 text-center py-4">No skills added yet. Go to Profile to add some!</p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-500 mb-2">Targeting <span className="text-white font-medium">{user?.targetRole || 'Software Developer'}</span></p>
                <div className="flex flex-wrap gap-2">
                  <p className="text-[10px] text-slate-500">Add skills to generate your AI roadmap.</p>
                </div>
              </div>
            </div>

            {/* Career GPS & Quick Actions */}
            <div className="flex flex-col gap-4">
              {/* Career GPS Card */}
              <div className="glass border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Career GPS</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center text-xs font-bold">You</div>
                  <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-blue-500 w-[45%]" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">🎯</div>
                </div>
                <p className="text-sm text-slate-400 text-center">45% towards <span className="text-white font-medium">{user?.targetRole || 'Full Stack Developer'}</span></p>
                <p className="text-xs text-slate-500 text-center mt-1">Est. 14 weeks at current pace</p>
                <Link to="/career-gps" className="mt-4 w-full flex items-center justify-center gap-1 text-xs font-semibold text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 py-2 rounded-lg transition-all">
                  <TrendingUp className="w-3 h-3" /> View Full Roadmap
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="glass border border-slate-800/50 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { icon: Bot, label: 'Ask AI Assistant', to: '/ai-assistant', color: 'text-primary-400 bg-primary-500/10' },
                    { icon: FileText, label: 'Resume Analyzer', to: '/resume-analyzer', color: 'text-green-400 bg-green-500/10' },
                    { icon: BookOpen, label: 'Find a Mentor', to: '/mentors', color: 'text-purple-400 bg-purple-500/10' },
                  ].map(({ icon: Icon, label, to, color }) => (
                    <Link key={label} to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 transition-all group">
                      <span className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Challenge */}
        {user?.role !== 'mentor' && (
          <div className="mt-6 glass border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl shrink-0">⚡</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-400">Daily Challenge</p>
              <p className="text-white font-medium">Build a REST API with Express & MongoDB</p>
              <p className="text-xs text-slate-400 mt-0.5">Earn 150 XP • Estimated: 45 minutes</p>
            </div>
            <Link to="/sandbox" className="shrink-0 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 text-sm font-semibold rounded-xl transition-all">
              Start Now
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
