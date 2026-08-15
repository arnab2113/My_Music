const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    avatar: { type: String, default: '/default-avatar.png' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    preferredTheme: { type: String, default: 'midnight-cafe' },
    preferredAccent: { type: String, default: '#f59e0b' }
  },
  { timestamps: true }
);

// Index automatically created by unique: true on email field

module.exports = mongoose.model('User', userSchema);
