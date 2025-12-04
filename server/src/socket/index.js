const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store online users: { oderId: { oderId, username, socketIds: Set } }
const onlineUsers = new Map();

const initializeSocket = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      socket.user = user;
      
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`🔌 User connected: ${socket.username} (${socket.id})`);

    // Add user to online users
    if (!onlineUsers.has(socket.userId)) {
      onlineUsers.set(socket.userId, {
        userId: socket.userId,
        username: socket.username,
        socketIds: new Set()
      });
    }
    onlineUsers.get(socket.userId).socketIds.add(socket.id);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Update user status to online
    await User.findByIdAndUpdate(socket.userId, { 
      status: 'online',
      lastSeen: new Date()
    });

    // Broadcast online status to all connected users
    io.emit('userOnline', {
      userId: socket.userId,
      username: socket.username
    });

    // Send current online users to the connected user
    const onlineUsersList = Array.from(onlineUsers.keys());
    socket.emit('onlineUsers', onlineUsersList);

    // Join chat rooms
    socket.on('joinChat', (chatId) => {
      socket.join(`chat:${chatId}`);
      console.log(`${socket.username} joined chat: ${chatId}`);
    });

    // Leave chat room
    socket.on('leaveChat', (chatId) => {
      socket.leave(`chat:${chatId}`);
      console.log(`${socket.username} left chat: ${chatId}`);
    });

    // Handle typing indicator
    socket.on('typing', ({ chatId, isTyping }) => {
      socket.to(`chat:${chatId}`).emit('userTyping', {
        chatId,
        userId: socket.userId,
        username: socket.username,
        isTyping
      });
    });

    // Handle new message (real-time broadcast)
    socket.on('sendMessage', (message) => {
      socket.to(`chat:${message.chat}`).emit('newMessage', message);
    });

    // Handle message read
    socket.on('messagesRead', ({ chatId }) => {
      socket.to(`chat:${chatId}`).emit('messagesRead', {
        chatId,
        userId: socket.userId
      });
    });

    // Handle status update
    socket.on('updateStatus', async (status) => {
      await User.findByIdAndUpdate(socket.userId, { 
        status,
        lastSeen: new Date()
      });
      
      io.emit('userStatusChanged', {
        userId: socket.userId,
        status
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.username} (${socket.id})`);

      // Remove socket from user's socket set
      const userData = onlineUsers.get(socket.userId);
      if (userData) {
        userData.socketIds.delete(socket.id);
        
        // If no more sockets, user is fully offline
        if (userData.socketIds.size === 0) {
          onlineUsers.delete(socket.userId);
          
          // Update user status to offline
          await User.findByIdAndUpdate(socket.userId, { 
            status: 'offline',
            lastSeen: new Date()
          });

          // Broadcast offline status
          io.emit('userOffline', {
            userId: socket.userId,
            username: socket.username
          });
        }
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.username}:`, error);
    });
  });

  return io;
};

module.exports = initializeSocket;
