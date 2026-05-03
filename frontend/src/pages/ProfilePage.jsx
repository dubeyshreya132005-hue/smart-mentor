import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, Code, Save, Plus, X, Loader2, ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    targetRole: user?.targetRole || '',
    skills: user?.skills || [],
    skillPoints: user?.skillPoints || {},
    expertise: user?.expertise || [],
    goals: user?.goals || '',
    experience: user?.experience || 0,
    hourlyRate: user?.hourlyRate || 0,
    achievements: user?.achievements || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (field) => {
    if (!newSkill.trim()) return;
    if (formData[field].includes(newSkill.trim())) {
      setNewSkill('');
      return;
    }
    const updated = [...formData[field], newSkill.trim()];
    // Initialize skill point to 50 if student and adding to skills
    const updatedPoints = field === 'skills'
      ? { ...formData.skillPoints, [newSkill.trim()]: 50 }
      : formData.skillPoints;
    setFormData({ ...formData, [field]: updated, skillPoints: updatedPoints });
    setNewSkill('');
  };

  const handleSkillPointChange = (skill, value) => {
    setFormData({
      ...formData,
      skillPoints: { ...formData.skillPoints, [skill]: Number(value) },
    });
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    if (formData.achievements.includes(newAchievement.trim())) {
      setNewAchievement('');
      return;
    }
    setFormData({
      ...formData,
      achievements: [...formData.achievements, newAchievement.trim()],
    });
    setNewAchievement('');
  };

  const handleRemoveSkill = (field, skill) => {
    const filtered = formData[field].filter((s) => s !== skill);
    let updatedPoints = { ...formData.skillPoints };
    if (field === 'skills') delete updatedPoints[skill];
    setFormData({ ...formData, [field]: filtered, skillPoints: updatedPoints });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const skillField = user?.role === 'mentor' ? 'expertise' : 'skills';

  return (
    <div className="min-h-screen bg-transparent text-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit Profile</h1>
          <p className="text-slate-600">Update your personal information and {user?.role === 'mentor' ? 'fields of expertise' : 'learning goals'}.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white/70 border border-slate-200 shadow-sm glass rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" /> Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Email Address</label>
                <div className="relative opacity-60">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 transition-all resize-none"
                placeholder="Tell us a bit about yourself..."
              />
            </div>
          </section>

          {/* Professional Info */}
          <section className="bg-white/70 border border-slate-200 shadow-sm glass rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" /> {user?.role === 'mentor' ? 'Mentorship' : 'Career'} Details
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">
                {user?.role === 'mentor' ? 'Current Title / Position' : 'Target Job Role'}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder={user?.role === 'mentor' ? 'e.g. Senior Software Engineer' : 'e.g. Full Stack Developer'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            {user?.role === 'student' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Learning Goals</label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 transition-all resize-none"
                  placeholder="What are your main goals? e.g. Learn full stack development, prepare for interviews"
                />
              </div>
            )}

            {user?.role === 'mentor' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Hourly Rate ($)</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  {user?.role === 'mentor' ? 'Fields of Expertise' : 'My Skills'}
                </label>
                {user?.role === 'student' && (
                  <p className="text-xs text-primary-600 mt-0.5 font-medium">
                    🎯 Rate each skill below to unlock your Skill Heatmap on the dashboard.
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(skillField))}
                    placeholder="Add a skill (e.g. React, Node.js)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddSkill(skillField)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all flex items-center gap-2 font-semibold shadow-lg shadow-primary-500/20"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-3 min-h-[40px]">
                {formData[skillField].length > 0 ? (
                  formData[skillField].map((skill) => (
                    <div key={skill} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-primary-700">{skill}</span>
                        <div className="flex items-center gap-2">
                          {user?.role === 'student' && (
                            <span className="text-xs font-bold text-primary-600 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
                              {formData.skillPoints[skill] ?? 50}%
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skillField, skill)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {user?.role === 'student' && (
                        <div>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={formData.skillPoints[skill] ?? 50}
                            onChange={(e) => handleSkillPointChange(skill, e.target.value)}
                            className="w-full h-2 accent-primary-600 rounded-full cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                            <span>Beginner</span><span>Expert</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600 italic p-4">No skills added yet.</p>
                )}
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section className="bg-white/70 border border-slate-200 shadow-sm glass rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> My Achievements
            </h2>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-600">
                Add your proudest professional or learning achievements
              </label>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                    placeholder="e.g. Won 1st place in Hackathon, Completed 100 Days of Code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-500 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-slate-800 rounded-xl transition-all flex items-center gap-2 font-semibold shadow-lg shadow-yellow-500/20"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="flex flex-col gap-2 min-h-[40px] p-4 bg-transparent/50 border border-slate-200 rounded-xl">
                {formData.achievements.length > 0 ? (
                  formData.achievements.map((achievement) => (
                    <div
                      key={achievement}
                      className="flex items-center justify-between p-3 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-sm font-medium"
                    >
                      <span>🏆 {achievement}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill('achievements', achievement)}
                        className="text-yellow-400 hover:text-red-400 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600 italic">No achievements added yet.</p>
                )}
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
