import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function BookingModal({ mentor, onClose }) {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: '',
    slot: '',
    topic: '',
    message: ''
  });

  const slots = ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/mentors/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mentorId: mentor._id,
          ...form
        })
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-transparent/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white/70 border border-slate-200 shadow-sm glass rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Book a Session</h2>
          <button onClick={onClose} className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-800 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 glass border border-primary-500/20 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-slate-600">Mentoring with</p>
                  <p className="font-bold text-slate-800 text-lg">{mentor.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-500" /> Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 text-slate-800"
                    onChange={(e) => setForm({...form, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" /> Select Slot
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 text-slate-800"
                    onChange={(e) => setForm({...form, slot: e.target.value})}
                  >
                    <option value="">Choose slot</option>
                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button
                disabled={!form.date || !form.slot}
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-primary-500/20"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary-500" /> What do you want to discuss?
                </label>
                <input
                  type="text"
                  placeholder="e.g., React System Design, Mock Interview"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 text-slate-800"
                  onChange={(e) => setForm({...form, topic: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Message to Mentor (Optional)</label>
                <textarea
                  placeholder="Tell the mentor about your current challenges..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 text-slate-800 h-32"
                  onChange={(e) => setForm({...form, message: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 glass border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-800 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.topic}
                  className="flex-[2] flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-primary-500/20"
                >
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Booking Request Sent!</h3>
              <p className="text-slate-600">
                Mentor will review your request and get back to you shortly. You can check your sessions in the dashboard.
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
