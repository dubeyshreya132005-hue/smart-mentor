import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Loader2, Target, ArrowLeft, Briefcase, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ResumeAnalyzerPage() {
  const { token, user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${API_URL}/ai/analyze-resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.message || 'Failed to analyze resume');
      }
    } catch (err) {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header className="mb-10 text-center">
          <div className="w-16 h-16 bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/10">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Resume Analyzer</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload your resume and let our AI suggest the best-fitting job roles based on your skills and projects.
          </p>
        </header>

        <div className="glass border border-slate-800/50 rounded-2xl p-8 mb-8 text-center max-w-2xl mx-auto">
          <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-8 mb-6 hover:border-primary-500/50 transition-colors">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="hidden" 
              id="resume-upload" 
            />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-dark-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary-400 transition-colors">
                {file ? <FileText className="w-6 h-6 text-primary-500" /> : <Upload className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  {file ? file.name : "Click to upload your resume"}
                </p>
                <p className="text-xs text-slate-500">PDF formats only (Max 5MB)</p>
              </div>
            </label>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
            {loading ? "Analyzing Profile..." : "Analyze Resume"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {analysis && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* ATS Score Card */}
              <div className="glass border border-slate-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Overall ATS Score</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-dark-700" />
                    <circle 
                      cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      className={`${analysis.atsScore >= 80 ? 'text-green-500' : analysis.atsScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * analysis.atsScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-extrabold text-white">{analysis.atsScore}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Strong Points */}
              <div className="glass border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" /> Strong Points
                </h3>
                <ul className="space-y-3">
                  {analysis.strongPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weak Points */}
              <div className="glass border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" /> Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {analysis.weakPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50">
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                <Briefcase className="w-6 h-6 text-primary-500" /> Top Suggested Roles
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {analysis.suggestions.map((s, idx) => (
                  <div key={idx} className="glass border border-primary-500/20 rounded-2xl p-6 hover:border-primary-500/50 transition-all hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-primary-500/10 text-primary-400 rounded-xl flex items-center justify-center font-bold">
                        #{idx + 1}
                      </div>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">
                        {s.matchScore} Match
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{s.role}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {s.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
