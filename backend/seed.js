const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const mentors = [
  {
    name: 'Sarah Drasner',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'mentor',
    isApproved: true,
    rating: 4.9,
    targetRole: 'Senior Frontend Engineer',
    bio: 'Expert in React, Vue, and Web Animations. I love helping students master the art of frontend development.',
    expertise: ['React', 'Vue', 'CSS', 'JavaScript'],
    experience: 12,
  },
  {
    name: 'Kent C. Dodds',
    email: 'kent@example.com',
    password: 'password123',
    role: 'mentor',
    isApproved: true,
    rating: 5.0,
    targetRole: 'Software Engineer & Educator',
    bio: 'Helping people build better software through testing and great patterns.',
    expertise: ['React', 'Testing', 'Node.js', 'JavaScript'],
    experience: 10,
  },
  {
    name: 'Dan Abramov',
    email: 'dan@example.com',
    password: 'password123',
    role: 'mentor',
    isApproved: true,
    rating: 4.8,
    targetRole: 'Principal Engineer',
    bio: 'Co-author of Redux and Create React App. Deep knowledge of React internals.',
    expertise: ['React', 'Redux', 'System Design', 'JavaScript'],
    experience: 15,
  },
  {
    name: 'Addy Osmani',
    email: 'addy@example.com',
    password: 'password123',
    role: 'mentor',
    isApproved: true,
    rating: 4.9,
    targetRole: 'Engineering Manager at Google',
    bio: 'Focused on performance and design patterns. I can help you scale your applications.',
    expertise: ['Performance', 'Design Patterns', 'JavaScript', 'System Design'],
    experience: 14,
  }
];

const seedMentors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mentorconnect');
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing mentors (optional)
    // await User.deleteMany({ role: 'mentor' });

    for (const mentorData of mentors) {
      const exists = await User.findOne({ email: mentorData.email });
      if (!exists) {
        await User.create(mentorData);
        console.log(`Seeded: ${mentorData.name}`);
      } else {
        console.log(`Skipped: ${mentorData.name} (exists)`);
      }
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMentors();
