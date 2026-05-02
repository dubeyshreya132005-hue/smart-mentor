import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, CheckCircle2, Circle, ArrowRight, Loader2, Target, Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CareerRoadmap() {
  const { user, token } = useAuth();
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai/roadmap`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setRoadmap(data.roadmap);
      } else {
        setError(data.message || 'Failed to generate roadmap');
      }
    } catch (err) {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-600/20 flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-primary-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Generating Your AI Roadmap...</h2>
        <p className="text-slate-400 max-w-sm">Gemini is analyzing your skills and goals to build a personalized path for you.</p>
        <div className="mt-8 flex gap-2">
           <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
           <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '200ms' }} />
           <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 border border-primary-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">AI Powered</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Career Roadmap</h1>
            <p className="text-slate-400 text-lg">Your personalized path to becoming a <span className="text-white font-semibold">{user?.targetRole || 'Full Stack Developer'}</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="glass border border-slate-800/50 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-white">{roadmap.filter(m => m.status === 'completed').length}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Completed</p>
            </div>
            <div className="glass border border-slate-800/50 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-primary-500">{roadmap.filter(m => m.status === 'pending').length}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">To Learn</p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="glass border border-red-500/20 rounded-2xl p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchRoadmap} className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all">
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {roadmap.map((milestone, idx) => (
              <div key={idx} className="relative pl-12 group">
                <div className={`absolute left-0 top-1.5 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all border-4 border-dark-900 ${
                  milestone.status === 'completed' 
                    ? 'bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                    : 'bg-slate-800 text-slate-500 group-hover:bg-primary-500/20 group-hover:text-primary-400'
                }`}>
                  {milestone.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>

                <div className="glass border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700 transition-all group-hover:translate-x-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`text-xl font-bold ${milestone.status === 'completed' ? 'text-white' : 'text-slate-300'}`}>
                      {milestone.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                      milestone.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {milestone.description}
                  </p>
                  
                  {milestone.resources && milestone.resources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/50">
                      {milestone.resources.map(res => (
                        <span key={res} className="text-[10px] px-2 py-1 rounded bg-dark-900 text-slate-500 border border-slate-800">
                          {res}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
           <div className="glass border border-primary-500/20 rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Trophy className="w-32 h-32 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to take the next step?</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Connect with a mentor who specializes in these areas to accelerate your learning.</p>
              <Link to="/mentors" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95">
                Find a Mentor <ArrowRight className="w-5 h-5" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
