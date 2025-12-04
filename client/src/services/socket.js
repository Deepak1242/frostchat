import { io } from 'socket.io-client';
import { useChatStore } from '../store/chatStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  // Handle online users
  socket.on('onlineUsers', (users) => {
    useChatStore.getState().setOnlineUsers(users);
  });

  socket.on('userOnline', ({ userId }) => {
    useChatStore.getState().addOnlineUser(userId);
  });

  socket.on('userOffline', ({ userId }) => {
    useChatStore.getState().removeOnlineUser(userId);
  });

  // Handle typing indicators
  socket.on('userTyping', ({ chatId, userId, username, isTyping }) => {
    useChatStore.getState().setTypingUser(chatId, userId, username, isTyping);
  });

  // Handle new messages
  socket.on('newMessage', (message) => {
    useChatStore.getState().addMessage(message);
    useChatStore.getState().updateChatLastMessage(message.chat, message);
  });

  // Handle new chat
  socket.on('newChat', (chat) => {
    useChatStore.getState().addChat(chat);
  });

  // Handle added to group
  socket.on('addedToGroup', (chat) => {
    useChatStore.getState().addChat(chat);
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
