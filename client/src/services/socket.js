import { io } from 'socket.io-client';
import { useChatStore } from '../store/chatStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;
let isInitializing = false;

export const initializeSocket = (token) => {
  // Prevent duplicate initialization
  if (isInitializing) {
    return socket;
  }
  
  // If already connected with same token, return existing socket
  if (socket?.connected) {
    return socket;
  }
  
  // If socket exists but disconnected, clean it up first
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  isInitializing = true;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    forceNew: false,
    multiplex: true
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
    isInitializing = false;
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    isInitializing = false;
  });

  // Handle online users
  socket.on('onlineUsers', (users) => {
    console.log('📡 Received online users list:', users);
    useChatStore.getState().setOnlineUsers(users);
  });

  socket.on('userOnline', ({ userId }) => {
    console.log('📡 User came online:', userId);
    useChatStore.getState().addOnlineUser(userId);
  });

  socket.on('userOffline', ({ userId }) => {
    console.log('📡 User went offline:', userId);
    useChatStore.getState().removeOnlineUser(userId);
  });

  // Handle typing indicators
  socket.on('userTyping', ({ chatId, userId, username, isTyping }) => {
    useChatStore.getState().setTypingUser(chatId, userId, username, isTyping);
  });

  // Handle new messages
  socket.on('newMessage', (message) => {
    const store = useChatStore.getState();
    const chatId = message.chat?._id || message.chat;
    
    // Add message to messages list if it's for the active chat
    store.addMessage(message);
    
    // Update last message for the chat
    store.updateChatLastMessage(chatId, message);
    
    // If message is not for active chat, increment unread count
    if (store.activeChat?._id !== chatId) {
      store.incrementUnread(chatId);
    }
  });

  // Handle new chat
  socket.on('newChat', (chat) => {
    useChatStore.getState().addChat(chat);
    // Auto-join the new chat room
    if (chat._id) {
      socket.emit('joinChat', chat._id);
    }
  });

  // Handle added to group
  socket.on('addedToGroup', (chat) => {
    useChatStore.getState().addChat(chat);
    // Auto-join the group chat room
    if (chat._id) {
      socket.emit('joinChat', chat._id);
    }
  });

  // Handle removed from group
  socket.on('removedFromGroup', (chatId) => {
    const { activeChat, chats } = useChatStore.getState();
    if (activeChat?._id === chatId) {
      useChatStore.setState({ activeChat: null, messages: [] });
    }
    useChatStore.setState({
      chats: chats.filter(c => c._id !== chatId)
    });
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinChat = (chatId) => {
  if (socket?.connected) {
    socket.emit('joinChat', chatId);
  }
};

export const leaveChat = (chatId) => {
  if (socket?.connected) {
    socket.emit('leaveChat', chatId);
  }
};

export const emitTyping = (chatId, isTyping) => {
  if (socket?.connected) {
    socket.emit('typing', { chatId, isTyping });
  }
};

export const emitMessagesRead = (chatId) => {
  if (socket?.connected) {
    socket.emit('messagesRead', { chatId });
  }
};
