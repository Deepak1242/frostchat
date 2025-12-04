const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create or get direct chat
exports.createOrGetDirectChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if direct chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [req.userId, participantId], $size: 2 }
    })
    .populate('participants', 'username displayName avatar status')
    .populate('lastMessage');

    if (chat) {
      return res.json({
        success: true,
        data: { chat }
      });
    }

    // Create new direct chat
    chat = new Chat({
      isGroupChat: false,
      participants: [req.userId, participantId],
      createdBy: req.userId
    });

    await chat.save();
    
    // Populate and return
    chat = await Chat.findById(chat._id)
      .populate('participants', 'username displayName avatar status');

    // Emit new chat to the other participant via Socket.IO
    const io = req.app.get('io');
    if (io) {
      // Notify the other participant about the new chat
      io.to(`user:${participantId}`).emit('newChat', chat);
    }

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: { chat }
    });
  } catch (error) {
    console.error('Create direct chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: error.message
    });
  }
};

// Create group chat
exports.createGroupChat = async (req, res) => {
  try {
    const { name, participantIds } = req.body;
    
    if (!name || !participantIds || participantIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Group name and at least 2 participants are required'
      });
    }

    // Add creator to participants
    const allParticipants = [...new Set([req.userId.toString(), ...participantIds])];

    // Create group chat
    let chat = new Chat({
      name,
      isGroupChat: true,
      participants: allParticipants,
      admins: [req.userId],
      createdBy: req.userId
    });

    await chat.save();

    // Create system message
    const systemMessage = new Message({
      chat: chat._id,
      sender: req.userId,
      content: `${req.user.displayName} created the group "${name}"`,
      messageType: 'system'
    });
    await systemMessage.save();

    chat.lastMessage = systemMessage._id;
    await chat.save();

    // Populate and return
    chat = await Chat.findById(chat._id)
      .populate('participants', 'username displayName avatar status')
      .populate('admins', 'username displayName')
      .populate('lastMessage');

    // Emit to all participants via Socket.IO
    const io = req.app.get('io');
    allParticipants.forEach(participantId => {
      io.to(`user:${participantId}`).emit('newChat', chat);
    });

    res.status(201).json({
      success: true,
      message: 'Group chat created successfully',
      data: { chat }
    });
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create group chat',
      error: error.message
    });
  }
};

// Get all chats for current user
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId
    })
    .populate('participants', 'username displayName avatar status lastSeen')
    .populate('admins', 'username displayName')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'username displayName'
      }
    })
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: { chats }
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chats',
      error: error.message
    });
  }
};

// Get single chat
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.userId
    })
    .populate('participants', 'username displayName avatar status lastSeen')
    .populate('admins', 'username displayName')
    .populate('lastMessage');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      data: { chat }
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat',
      error: error.message
    });
  }
};

// Update group chat
exports.updateGroupChat = async (req, res) => {
  try {
    const { name } = req.body;
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      isGroupChat: true,
      admins: req.userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Group chat not found or you are not an admin'
      });
    }

    if (name) chat.name = name;
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'username displayName avatar status')
      .populate('admins', 'username displayName');

    res.json({
      success: true,
      message: 'Group updated successfully',
      data: { chat: updatedChat }
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update group',
      error: error.message
    });
  }
};

// Add participants to group
exports.addParticipants = async (req, res) => {
  try {
    const { participantIds } = req.body;
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      isGroupChat: true,
      admins: req.userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Group chat not found or you are not an admin'
      });
    }

    // Add new participants
    const newParticipants = participantIds.filter(
      id => !chat.participants.includes(id)
    );

    chat.participants.push(...newParticipants);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'username displayName avatar status');

    // Notify new participants
    const io = req.app.get('io');
    newParticipants.forEach(participantId => {
      io.to(`user:${participantId}`).emit('addedToGroup', updatedChat);
    });

    res.json({
      success: true,
      message: 'Participants added successfully',
      data: { chat: updatedChat }
    });
  } catch (error) {
    console.error('Add participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add participants',
      error: error.message
    });
  }
};

// Remove participant from group
exports.removeParticipant = async (req, res) => {
  try {
    const { chatId, userId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      isGroupChat: true,
      admins: req.userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Group chat not found or you are not an admin'
      });
    }

    // Cannot remove last admin
    if (chat.admins.length === 1 && chat.admins[0].toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the last admin. Make someone else admin first.'
      });
    }

    chat.participants = chat.participants.filter(p => p.toString() !== userId);
    chat.admins = chat.admins.filter(a => a.toString() !== userId);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'username displayName avatar status');

    // Notify removed user
    const io = req.app.get('io');
    io.to(`user:${userId}`).emit('removedFromGroup', chatId);

    res.json({
      success: true,
      message: 'Participant removed successfully',
      data: { chat: updatedChat }
    });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove participant',
      error: error.message
    });
  }
};

// Leave group
exports.leaveGroup = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      isGroupChat: true,
      participants: req.userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Group chat not found'
      });
    }

    // If user is the only admin, make someone else admin
    if (chat.admins.length === 1 && chat.admins[0].toString() === req.userId.toString()) {
      const otherParticipants = chat.participants.filter(
        p => p.toString() !== req.userId.toString()
      );
      if (otherParticipants.length > 0) {
        chat.admins = [otherParticipants[0]];
      }
    }

    chat.participants = chat.participants.filter(
      p => p.toString() !== req.userId.toString()
    );
    chat.admins = chat.admins.filter(
      a => a.toString() !== req.userId.toString()
    );

    // If no participants left, delete the chat
    if (chat.participants.length === 0) {
      await Message.deleteMany({ chat: chatId });
      await Chat.findByIdAndDelete(chatId);
      return res.json({
        success: true,
        message: 'Left group and group was deleted (no remaining members)'
      });
    }

    await chat.save();

    res.json({
      success: true,
      message: 'Left group successfully'
    });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave group',
      error: error.message
    });
  }
};
