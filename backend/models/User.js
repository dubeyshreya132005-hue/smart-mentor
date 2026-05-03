const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['student', 'mentor', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    // Common profile fields
    skills: [{ type: String }],
    skillPoints: {
      type: Map,
      of: { type: Number, min: 0, max: 100 },
      default: {},
    },
    interests: [{ type: String }],
    goals: { type: String, default: '' },
    achievements: [{ type: String }],
    // Social links
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    // Student-specific
    targetRole: { type: String, default: '' },
    learningStyle: {
      type: String,
      enum: ['friendly', 'strict', 'formal', 'motivational'],
      default: 'friendly',
    },
    languagePreference: {
      type: String,
      enum: ['english', 'hinglish'],
      default: 'english',
    },
    confidenceMeter: { type: Number, default: 50, min: 0, max: 100 },
    // Mentor-specific
    expertise: [{ type: String }],
    experience: { type: Number, default: 0 }, // years
    hourlyRate: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    availability: [
      {
        day: String,
        slots: [String],
      },
    ],
    isApproved: { type: Boolean, default: false }, // Admin must approve mentors
    // Gamification
    xp: { type: Number, default: 0 },
    badges: [{ type: String }],
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
