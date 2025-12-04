const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: [50, 'Display name cannot exceed 50 characters']
  },
  avatar: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away', 'busy'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Set display name to username if not provided
userSchema.pre('save', function(next) {
  if (!this.displayName) {
    this.displayName = this.username;
  }
  next();
});

// Virtual for 'name' field (alias for displayName for frontend compatibility)
userSchema.virtual('name').get(function() {
  return this.displayName || this.username;
});

// Virtual for 'isOnline' based on status
userSchema.virtual('isOnline').get(function() {
  return this.status === 'online';
});

// Ensure virtuals are included in JSON and Object output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject({ virtuals: true });
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
