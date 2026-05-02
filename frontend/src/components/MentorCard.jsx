import React from 'react';
import { Star, MessageSquare, Calendar, ChevronRight } from 'lucide-react';

export default function MentorCard({ mentor, onBook }) {
  return (
    <div className="glass border border-slate-800/50 rounded-2xl p-6 hover:border-primary-500/50 transition-all group">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {mentor.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white truncate">{mentor.name}</h3>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">{mentor.rating || '4.9'}</span>
            </div>
          </div>
          <p className="text-sm text-primary-400 font-medium">{mentor.targetRole || 'Senior Engineer'}</p>
          {mentor.matchScore && (
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500" style={{ width: `${mentor.matchScore}%` }} />
              </div>
              <span className="text-[10px] font-bold text-primary-400">{mentor.matchScore}% Match</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
        {mentor.bio || 'Experienced professional helping students bridge the gap to their career goals.'}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(mentor.expertise || ['React', 'Node.js', 'System Design']).slice(0, 3).map((skill) => (
          <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full bg-dark-700 text-slate-300 border border-slate-700/50">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-500 transition-all" onClick={() => onBook(mentor)}>
          Book Session
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
