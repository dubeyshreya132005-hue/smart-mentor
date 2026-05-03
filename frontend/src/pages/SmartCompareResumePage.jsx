import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Upload, FileText, Loader2, ArrowLeft, Briefcase, CheckCircle,
  AlertTriangle, X, Sparkles, Target, Trophy, ChevronDown, ChevronUp,
  Search, Zap, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── ATS Score Ring ─────────────────────────────────────────────────────────
function ScoreRing({ score, size = 120 }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const color = score >= 75 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#ef4444';
  const bg = score >= 75 ? '#dcfce7' : score >= 50 ? '#fef3c7' : '#fee2e2';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
        <circle
          cx="50" cy="50" r={r}
          stroke={color} strokeWidth="10" fill="transparent"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-extrabold" style={{ color }}>{score}</span>
        <span className="text-[10px] font-bold text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

// ── Resume File Card ───────────────────────────────────────────────────────
function ResumeFileCard({ file, index, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-primary-100 shadow-sm group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-md">
        <FileText className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
        <p className="text-xs text-slate-500 font-medium">{(file.size / 1024).toFixed(0)} KB · PDF</p>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Result Card ────────────────────────────────────────────────────────────
function ResultCard({ result, rank }) {
  const [expanded, setExpanded] = useState(true);
  const rankColors = ['from-yellow-400 to-orange-400', 'from-slate-400 to-slate-500', 'from-amber-600 to-amber-700'];
  const rankLabels = ['🥇 Best Match', '🥈 2nd Place', '🥉 3rd Place'];
  const scoreColor = result.atsScore >= 75 ? 'text-green-600' : result.atsScore >= 50 ? 'text-yellow-600' : 'text-red-500';
  const scoreBg = result.atsScore >= 75 ? 'bg-green-50 border-green-200' : result.atsScore >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  return (
    <div className={`glass-card rounded-3xl overflow-hidden ${rank === 0 ? 'ring-2 ring-primary-400 ring-offset-2' : ''}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${rankColors[rank] || 'from-slate-300 to-slate-400'} p-0.5`} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {rank < 3 && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${rankColors[rank]} text-white shadow-sm`}>
                  {rankLabels[rank]}
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 truncate">{result.resumeName}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{result.fitSummary}</p>
          </div>
          <div className="shrink-0">
            <ScoreRing score={result.atsScore} size={100} />
          </div>
        </div>

        {/* Keyword overlap pill row */}
        {result.matchedKeywords?.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Matched JD Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {result.matchedKeywords.slice(0, 12).map(kw => (
                <span key={kw} className="px-2.5 py-1 bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-200 text-sm font-bold text-slate-600 hover:text-primary-700 transition-all"
        >
          <span>Detailed Analysis</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {/* Strong Points */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-extrabold text-green-700">Strong Points</h4>
              </div>
              <ul className="space-y-2">
                {result.strongPoints?.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-green-800 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weak Points */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-extrabold text-red-700">Areas to Improve</h4>
              </div>
              <ul className="space-y-2">
                {result.weakPoints?.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-red-800 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-extrabold text-amber-700">Missing Keywords</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords?.slice(0, 10).map(kw => (
                  <span key={kw} className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function SmartCompareResumePage() {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    addFiles(dropped);
  };

  const addFiles = (newFiles) => {
    setFiles(prev => {
      const combined = [...prev, ...newFiles];
      if (combined.length > 5) return combined.slice(0, 5);
      return combined;
    });
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleAnalyze = async () => {
    if (files.length === 0) return setError('Please upload at least one resume.');
    if (jobDesc.trim().length < 30) return setError('Please enter a more detailed job description.');

    setLoading(true);
    setError(null);
    setResults(null);

    const steps = [
      'Extracting text from PDFs…',
      'Running RAG chunking & keyword retrieval…',
      'Scoring resumes against job description…',
      'Generating detailed analysis…',
    ];
    let stepIdx = 0;
    setProgress(steps[0]);
    const timer = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setProgress(steps[stepIdx]);
    }, 3500);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('resumes', f));
      formData.append('jobDescription', jobDesc);

      const res = await fetch(`${API_URL}/ai/compare-resumes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.message || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      clearInterval(timer);
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="min-h-screen mesh-bg">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary-700 mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl btn-glow flex items-center justify-center shadow-xl shrink-0">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900">Smart Resume Comparator</h1>
              <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-primary-500 to-emerald-500 text-white rounded-full shadow-sm">RAG-Powered</span>
            </div>
            <p className="text-slate-500 font-medium">Upload up to 5 resumes, paste the job description, and let AI rank them by JD fit using Retrieval-Augmented Generation.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Upload, step: '1', label: 'Upload Resumes', desc: 'Up to 5 PDF resumes', color: 'from-primary-500 to-emerald-500' },
            { icon: BookOpen, step: '2', label: 'Paste Job Description', desc: 'The JD you want to apply for', color: 'from-emerald-500 to-teal-500' },
            { icon: Sparkles, step: '3', label: 'AI RAG Analysis', desc: 'Get ranked ATS scores', color: 'from-teal-500 to-cyan-500' },
          ].map(({ icon: Icon, step, label, desc, color }) => (
            <div key={step} className="glass-card rounded-2xl p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-0.5">STEP {step}</p>
                <p className="text-sm font-extrabold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500 font-medium">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Resume Upload */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" /> Resumes
                <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{files.length}/5</span>
              </h2>
              {files.length > 0 && (
                <button onClick={() => setFiles([])} className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors">
                  Clear all
                </button>
              )}
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary-200 hover:border-primary-400 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-primary-50/50 mb-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-sm font-bold text-slate-700">Drop PDFs here or <span className="text-primary-600">browse</span></p>
              <p className="text-xs text-slate-500 font-medium mt-1">Max 5 resumes · PDF only · 10MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={e => addFiles(Array.from(e.target.files))}
              />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((f, i) => (
                  <ResumeFileCard key={i} file={f} index={i} onRemove={removeFile} />
                ))}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="glass-card rounded-3xl p-6 flex flex-col">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-emerald-600" /> Job Description
            </h2>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here…

Example:
We are looking for a Senior React Developer with 3+ years of experience in React, TypeScript, Node.js. The candidate should be familiar with RESTful APIs, GraphQL, CI/CD pipelines, and cloud services (AWS/GCP). Strong problem-solving skills and experience with agile methodology required."
              className="flex-1 input-field rounded-2xl p-4 text-sm text-slate-700 font-medium resize-none min-h-[220px] leading-relaxed"
              style={{ fontFamily: 'inherit' }}
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-slate-400 font-medium">{jobDesc.length} chars · {jobDesc.trim().split(/\s+/).filter(Boolean).length} words</p>
              {jobDesc.length < 30 && jobDesc.length > 0 && (
                <p className="text-xs text-amber-600 font-bold">⚠ Add more detail for better results</p>
              )}
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || files.length === 0 || jobDesc.trim().length < 30}
          className="w-full btn-glow py-5 text-white font-extrabold text-lg rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3 mb-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-base font-bold">{progress}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze &amp; Rank Resumes with RAG
              <span className="ml-1 text-sm font-medium opacity-80">({files.length} resume{files.length !== 1 ? 's' : ''})</span>
            </>
          )}
        </button>

        {/* Loading animation */}
        {loading && (
          <div className="glass-card rounded-2xl p-6 mb-6 flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-3 h-3 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-600">{progress}</p>
            <p className="text-xs text-slate-400 font-medium">This may take 20–60 seconds depending on resume length</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold mb-6">
            <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div>
            {/* Summary bar */}
            <div className="glass-card rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800">Analysis Complete</p>
                  <p className="text-xs text-slate-500 font-medium">{results.length} resume{results.length !== 1 ? 's' : ''} ranked by JD match score</p>
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="text-center">
                  <p className="text-2xl font-extrabold gradient-text">{results[0]?.atsScore ?? '-'}</p>
                  <p className="text-xs text-slate-500 font-medium">Top ATS Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-slate-800">{Math.round(results.reduce((s, r) => s + r.atsScore, 0) / results.length)}</p>
                  <p className="text-xs text-slate-500 font-medium">Avg. Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-slate-800">{results.length}</p>
                  <p className="text-xs text-slate-500 font-medium">Resumes</p>
                </div>
              </div>
            </div>

            {/* Result cards */}
            <div className="space-y-5">
              {results.map((result, idx) => (
                <ResultCard key={idx} result={result} rank={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
