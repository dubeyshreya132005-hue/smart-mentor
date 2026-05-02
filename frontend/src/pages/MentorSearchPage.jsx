import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MentorCard from '../components/MentorCard';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function MentorSearchPage() {
  const { token } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    fetchMentors();
    fetchRecommendations();
  }, [search, skill]);

  const fetchMentors = async () => {
    try {
      const res = await fetch(`${API_URL}/mentors?search=${search}&skill=${skill}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMentors(data.mentors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`${API_URL}/mentors/match`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecommendations(data.recommendations);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = (mentor) => {
    setSelectedMentor(mentor);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 p-6">
      {selectedMentor && (
        <BookingModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
      )}
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Find Your Perfect Mentor
              <Sparkles className="w-6 h-6 text-primary-500" />
            </h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">AI-powered matching based on your goals and skill gaps.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or bio..."
                className="bg-dark-800 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500 transition-all w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-2.5 glass border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-bold text-white">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(mentor => (
                <MentorCard key={mentor._id} mentor={mentor} onBook={handleBook} />
              ))}
            </div>
          </section>
        )}

        {/* All Mentors */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">All Mentors</h2>
            <div className="flex items-center gap-2">
              {['Frontend', 'Backend', 'AI/ML', 'Mobile'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSkill(skill === cat ? '' : cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                    skill === cat ? 'bg-primary-600 border-primary-500 text-white' : 'glass border-slate-700/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map(mentor => (
                <MentorCard key={mentor._id} mentor={mentor} onBook={handleBook} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass border border-slate-800/50 rounded-2xl">
              <p className="text-slate-500">No mentors found matching your criteria.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
