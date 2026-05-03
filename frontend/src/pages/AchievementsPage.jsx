import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Star, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AchievementsPage() {
  const { user } = useAuth();
  const achievements = user?.achievements || [];

  return (
    <div className="min-h-screen bg-transparent text-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Your Hall of Fame
          </h1>
          <p className="text-slate-600 text-lg">
            Track your progress, showcase your milestones, and celebrate your wins!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.length > 0 ? (
            achievements.map((ach, idx) => (
              <div key={idx} className="glass border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/50 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-snug">{ach}</h3>
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-yellow-500/70 uppercase tracking-widest">Unlocked</span>
                  <Shield className="w-4 h-4 text-yellow-500/50" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white/70 border border-slate-200 shadow-sm glass rounded-2xl p-12 text-center">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No achievements yet</h2>
              <p className="text-slate-600 mb-6">Head over to your profile to add your first big win!</p>
              <Link to="/profile" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all">
                Add Achievement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
