const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, bio, status } = req.body;
    
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (status !== undefined) updateData.status = status;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Update avatar
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old avatar from Cloudinary if exists
    if (user.avatar?.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }

    // Upload new avatar to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'frostchat/avatars',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    // Update user avatar
    user.avatar = {
      url: result.secure_url,
      publicId: result.public_id
    };
    await user.save();

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update avatar',
      error: error.message
    });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 1) {
      return res.json([]);
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.userId } }, // Exclude current user
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('username name avatar isOnline lastSeen')
    .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

// Get all users (for contacts)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('username displayName avatar status lastSeen')
      .sort({ displayName: 1 });

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// Update user status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['online', 'offline', 'away', 'busy'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { status, lastSeen: new Date() },
      { new: true }
    );

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
};
