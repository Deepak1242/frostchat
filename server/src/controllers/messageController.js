const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Get messages for a chat
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const messages = await Message.find({ 
      chat: chatId,
      isDeleted: false 
    })
    .populate('sender', 'username displayName avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    const total = await Message.countDocuments({ 
      chat: chatId, 
      isDeleted: false 
    });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages',
      error: error.message
    });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text' } = req.body;

    // Verify user is part of the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Create message
    let message = new Message({
      chat: chatId,
      sender: req.userId,
      content,
      messageType
    });

    await message.save();

    // Update chat's last message
    chat.lastMessage = message._id;
    await chat.save();

    // Populate sender info
    message = await Message.findById(message._id)
      .populate('sender', 'username displayName avatar');

    // Emit to all participants in the chat via Socket.IO
    const io = req.app.get('io');
    io.to(`chat:${chatId}`).emit('newMessage', message);

    res.status(201).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Send message with attachment
exports.sendMessageWithAttachment = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, attachmentUrl, attachmentPublicId, fileName, fileSize, fileType, messageType } = req.body;

    // Verify user is part of the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Create message with attachment
    let message = new Message({
      chat: chatId,
      sender: req.userId,
      content: content || '',
      messageType: messageType || 'file',
      attachment: {
        url: attachmentUrl,
        publicId: attachmentPublicId,
        fileName,
        fileSize,
        fileType
      }
    });

    await message.save();

    // Update chat's last message
    chat.lastMessage = message._id;
    await chat.save();

    // Populate sender info
    message = await Message.findById(message._id)
      .populate('sender', 'username displayName avatar');

    // Emit to all participants in the chat via Socket.IO
    const io = req.app.get('io');
    io.to(`chat:${chatId}`).emit('newMessage', message);

    res.status(201).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Send message with attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verify user is part of the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Update all unread messages in the chat
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.userId },
        'readBy.user': { $ne: req.userId }
      },
      {
        $push: {
          readBy: { user: req.userId, readAt: new Date() }
        }
      }
    );

    // Emit read status to chat participants
    const io = req.app.get('io');
    io.to(`chat:${chatId}`).emit('messagesRead', {
      chatId,
      userId: req.userId
    });

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};

// Delete message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      sender: req.userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or you are not the sender'
      });
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    await message.save();

    // Emit delete event
    const io = req.app.get('io');
    io.to(`chat:${message.chat}`).emit('messageDeleted', {
      messageId,
      chatId: message.chat
    });

    res.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

// Edit message
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findOne({
      _id: messageId,
      sender: req.userId,
      messageType: 'text'
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or cannot be edited'
      });
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'username displayName avatar');

    // Emit edit event
    const io = req.app.get('io');
    io.to(`chat:${message.chat}`).emit('messageEdited', updatedMessage);

    res.json({
      success: true,
      data: { message: updatedMessage }
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit message',
      error: error.message
    });
  }
};
