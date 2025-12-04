const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  attachment: {
    url: {
      type: String
    },
    publicId: {
      type: String
    },
    fileName: {
      type: String
    },
    fileSize: {
      type: Number
    },
    fileType: {
      type: String
    }
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

// Validate that message has either content or attachment
messageSchema.pre('save', function(next) {
  if (!this.content && !this.attachment?.url && this.messageType !== 'system') {
    return next(new Error('Message must have either content or attachment'));
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
