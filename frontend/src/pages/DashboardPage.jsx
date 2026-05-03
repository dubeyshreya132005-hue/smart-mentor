import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bot, Code, LineChart, BookOpen, Calendar, MessageSquare,
  Trophy, Target, TrendingUp, LogOut, User, Zap, FileText, BarChart2, AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, color, sub, iconBg }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 rounded-2xl ${iconBg || 'bg-gradient-to-br from-primary-500 to-emerald-500'} flex items-center justify-center shrink-0 shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-800">{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-primary-600 font-semibold mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function SkillBar({ skill, level, color }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-700 font-semibold">{skill}</span>
        <span className="text-primary-600 font-bold">{level}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all shadow-sm`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active
          ? 'nav-active shadow-sm'
          : 'text-slate-500 hover:bg-primary-50 hover:text-primary-700'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-primary-600' : ''}`} />
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

  // --- Real skill heatmap logic ---
  // skillPoints is a Map (object) from skill name → 0-100
  const rawSkillPoints = user?.skillPoints || {};
  // Mongoose Map comes back as a plain object from API
  const skillPointsObj = rawSkillPoints instanceof Map
    ? Object.fromEntries(rawSkillPoints)
    : rawSkillPoints;

  const userSkills = user?.skills || [];
  const skillColors = ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'];

  // All skills have points = every skill has an entry in skillPoints with a value
  const allSkillsHavePoints =
    userSkills.length > 0 &&
    userSkills.every((s) => skillPointsObj[s] !== undefined && skillPointsObj[s] !== null);

  const skillsData = userSkills.map((s, idx) => ({
    skill: s,
    level: skillPointsObj[s] ?? null,
    color: skillColors[idx % skillColors.length],
  }));

  // Real XP progress (cap at 1000 per level)
  const xp = user?.xp || 0;
  const xpInLevel = xp % 1000;
  const xpPercent = Math.round((xpInLevel / 1000) * 100);

  // Career GPS: average skill points as progress
  const avgSkillLevel = allSkillsHavePoints
    ? Math.round(skillsData.reduce((sum, s) => sum + s.level, 0) / skillsData.length)
    : null;

  return (
    <div className="min-h-screen mesh-bg flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col p-4 gap-1 border-r border-primary-100/60" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)' }}>
        <Link to="/" className="flex items-center gap-2.5 px-3 py-3 mb-5">
          <div className="w-8 h-8 rounded-xl btn-glow flex items-center justify-center shadow-md">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">MentorConnect <span className="gradient-text">AI</span></span>
        </Link>

        <NavItem icon={LineChart} label="Dashboard" to="/dashboard" active />
        <NavItem icon={User} label="My Profile" to="/profile" />
        <NavItem icon={Bot} label="AI Assistant" to="/ai-assistant" />
        <NavItem icon={FileText} label="Resume Analyzer" to="/resume-analyzer" />
        <NavItem icon={Zap} label="Smart Compare" to="/smart-compare" />
        {user?.role !== 'mentor' && <NavItem icon={BookOpen} label="Mentors" to="/mentors" />}
        <NavItem icon={Calendar} label="Sessions" to="/sessions" />
        <NavItem icon={Code} label="Code Sandbox" to="/sandbox" />
        <NavItem icon={MessageSquare} label="Messages" to="/messages" />
        <NavItem icon={Trophy} label="Achievements" to="/achievements" />

        <div className="mt-auto">
          <div className="glass-card rounded-2xl p-4 mb-3 border border-primary-100">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl btn-glow flex items-center justify-center text-sm font-extrabold text-white shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize font-medium">{user?.role}</p>
              </div>
            </div>
            {/* Real XP progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">{xpInLevel} / 1000 XP</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {/* Header — no mock streak badge */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Here's your learning overview for today.</p>
        </div>

        {/* Stats */}
        {user?.role === 'mentor' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Target} label="Total Earnings" value={`$${(user?.totalSessions || 0) * (user?.hourlyRate || 0)}`} iconBg="bg-gradient-to-br from-green-500 to-emerald-500" sub="All time" />
            <StatCard icon={Trophy} label="Rating" value={`${user?.rating || 0} ⭐`} iconBg="bg-gradient-to-br from-yellow-400 to-orange-400" sub={user?.rating ? 'Your current rating' : 'No reviews yet'} />
            <StatCard icon={Calendar} label="Sessions Done" value={user?.totalSessions || 0} iconBg="bg-gradient-to-br from-primary-500 to-teal-500" sub="Great job!" />
            <StatCard icon={User} label="Years of Experience" value={user?.experience || 0} iconBg="bg-gradient-to-br from-purple-500 to-pink-500" sub={user?.experience ? `${user.experience} yr${user.experience > 1 ? 's' : ''}` : 'Add in profile'} />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Trophy} label="XP Points" value={user?.xp || 0} iconBg="bg-gradient-to-br from-yellow-400 to-orange-400" sub={user?.xp ? `Level ${Math.floor((user.xp || 0) / 1000) + 1}` : 'Start earning XP!'} />
            <StatCard icon={Target} label="Skill Score" value={`${user?.confidenceMeter || 0}%`} iconBg="bg-gradient-to-br from-primary-500 to-emerald-500" sub="Your confidence level" />
            <StatCard icon={Calendar} label="Sessions Done" value={user?.totalSessions || 0} iconBg="bg-gradient-to-br from-teal-500 to-cyan-500" sub={user?.totalSessions ? 'Keep going!' : 'Book your first session'} />
            <StatCard icon={Zap} label="Day Streak" value={`${user?.streak || 0} Days`} iconBg="bg-gradient-to-br from-purple-500 to-indigo-500" sub={user?.streak ? 'Keep it up! 🔥' : 'Login daily to streak'} />
          </div>
        )}

        {user?.role === 'mentor' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/70 border border-slate-200 shadow-sm glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Upcoming Sessions & Requests</h2>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold text-white">
                          {b.student?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{b.student?.name}</p>
                          <p className="text-xs text-slate-600">{new Date(b.date).toLocaleDateString()} at {b.slot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          b.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                          'bg-slate-500/10 text-slate-600'
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
                <p className="text-slate-600 text-sm italic mb-6 text-center py-4">No requests or upcoming sessions. Make sure your availability is up to date.</p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white/70 border border-slate-200 shadow-sm glass rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h3>
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
                      <span className="text-sm text-slate-700 group-hover:text-slate-800 transition-colors">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Skill Heatmap — shown only when all skills have points set */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-slate-800">Skill Heatmap</h2>
                </div>
                <Link to="/profile" className="text-xs font-bold text-primary-600 hover:text-primary-500 transition-colors bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200">
                  Edit Skills →
                </Link>
              </div>

              {userSkills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <AlertCircle className="w-10 h-10 text-slate-300" />
                  <p className="text-slate-500 font-semibold">No skills added yet</p>
                  <p className="text-sm text-slate-400">Go to your profile to add skills and rate your proficiency.</p>
                  <Link to="/profile" className="mt-2 px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary-500/20">
                    Add Skills Now
                  </Link>
                </div>
              ) : !allSkillsHavePoints ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <BarChart2 className="w-10 h-10 text-slate-300" />
                  <p className="text-slate-500 font-semibold">Rate all your skills to unlock the heatmap</p>
                  <p className="text-sm text-slate-400">
                    You have {userSkills.filter(s => skillPointsObj[s] !== undefined).length}/{userSkills.length} skills rated.
                    Set proficiency levels for all skills in your profile.
                  </p>
                  <Link to="/profile" className="mt-2 px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary-500/20">
                    Set Skill Points
                  </Link>
                </div>
              ) : (
                <>
                  {skillsData.map((s) => <SkillBar key={s.skill} {...s} />)}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1 font-medium">
                      Targeting <span className="text-primary-700 font-bold">{user?.targetRole || 'a role'}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Based on your self-rated skill points from your profile.</p>
                  </div>
                </>
              )}
            </div>

            {/* Career GPS & Quick Actions */}
            <div className="flex flex-col gap-4">
              {/* Career GPS Card */}
              <div className="bg-white/70 border border-slate-200 shadow-sm glass rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Career GPS</h2>
                {avgSkillLevel !== null ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center text-xs font-bold">You</div>
                      <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 transition-all" style={{ width: `${avgSkillLevel}%` }} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">🎯</div>
                    </div>
                    <p className="text-sm text-slate-600 text-center">
                      {avgSkillLevel}% avg. proficiency towards{' '}
                      <span className="text-slate-800 font-medium">{user?.targetRole || 'your goal'}</span>
                    </p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500">Rate your skills to see your progress towards</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">{user?.targetRole || 'your target role'}</p>
                  </div>
                )}
                <Link to="/career-gps" className="mt-4 w-full flex items-center justify-center gap-1 text-xs font-semibold text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 py-2 rounded-lg transition-all">
                  <TrendingUp className="w-3 h-3" /> View Full Roadmap
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h3>
                <div className="space-y-1.5">
                  {[
                    { icon: Bot, label: 'Ask AI Assistant', to: '/ai-assistant', color: 'text-primary-600 bg-primary-100' },
                    { icon: FileText, label: 'Resume Analyzer', to: '/resume-analyzer', color: 'text-green-600 bg-green-100' },
                    { icon: Zap, label: 'Smart Compare', to: '/smart-compare', color: 'text-emerald-600 bg-emerald-100' },
                    { icon: BookOpen, label: 'Find a Mentor', to: '/mentors', color: 'text-purple-600 bg-purple-100' },
                  ].map(({ icon: Icon, label, to, color }) => (
                    <Link key={label} to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all group">
                      <span className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-primary-700 transition-colors">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
