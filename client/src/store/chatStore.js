import { create } from 'zustand';
import api from '../services/api';

export const useChatStore = create((set, get) => ({
  chats: [],
  activeChat: null,
  messages: [],
  isLoadingChats: false,
  isLoadingMessages: false,
  typingUsers: {}, // { chatId: [{ userId, username }] }
  onlineUsers: [], // [userId1, userId2, ...]
  unreadCounts: {}, // { chatId: count }

  // Clear all state on logout
  clearAll: () => set({
    chats: [],
    activeChat: null,
    messages: [],
    isLoadingChats: false,
    isLoadingMessages: false,
    typingUsers: {},
    onlineUsers: [],
    unreadCounts: {}
  }),

  setChats: (chats) => set({ chats }),

  setOnlineUsers: (users) => {
    console.log('📡 Online users updated:', users);
    // Ensure all IDs are strings for consistent comparison
    const stringIds = Array.isArray(users) ? users.map(id => String(id)) : [];
    set({ onlineUsers: stringIds });
  },

  addOnlineUser: (userId) => {
    const id = String(userId);
    console.log('📡 User came online:', id);
    set((state) => ({
      onlineUsers: [...new Set([...state.onlineUsers, id])]
    }));
  },

  removeOnlineUser: (userId) => {
    const id = String(userId);
    console.log('📡 User went offline:', id);
    set((state) => {
      const newOnlineUsers = state.onlineUsers.filter(uid => uid !== id);
      console.log('📡 Updated online users:', newOnlineUsers);
      return { onlineUsers: newOnlineUsers };
    });
  },

  incrementUnread: (chatId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: (state.unreadCounts[chatId] || 0) + 1
      }
    }));
  },

  clearUnread: (chatId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: 0
      }
    }));
  },

  setTypingUser: (chatId, userId, username, isTyping) => {
    set((state) => {
      const chatTypingUsers = state.typingUsers[chatId] || [];
      
      if (isTyping) {
        // Add typing user if not already present
        if (!chatTypingUsers.find(u => u.userId === userId)) {
          return {
            typingUsers: {
              ...state.typingUsers,
              [chatId]: [...chatTypingUsers, { userId, username }]
            }
          };
        }
      } else {
        // Remove typing user
        return {
          typingUsers: {
            ...state.typingUsers,
            [chatId]: chatTypingUsers.filter(u => u.userId !== userId)
          }
        };
      }
      return state;
    });
  },

  fetchChats: async () => {
    set({ isLoadingChats: true });
    try {
      const response = await api.get('/chats');
      set({ chats: response.data.data.chats, isLoadingChats: false });
    } catch (error) {
      console.error('Fetch chats error:', error);
      set({ isLoadingChats: false });
    }
  },

  setActiveChat: (chat) => {
    set({ activeChat: chat, messages: [] });
    if (chat) {
      get().fetchMessages(chat._id);
      get().clearUnread(chat._id);
    }
  },

  fetchMessages: async (chatId) => {
    set({ isLoadingMessages: true });
    try {
      const response = await api.get(`/messages/chat/${chatId}`);
      set({ messages: response.data.data.messages, isLoadingMessages: false });
    } catch (error) {
      console.error('Fetch messages error:', error);
      set({ isLoadingMessages: false });
    }
  },

  addMessage: (message) => {
    set((state) => {
      // Only add if message is for active chat
      if (state.activeChat?._id === message.chat || state.activeChat?._id === message.chat?._id) {
        // Check if message already exists
        const exists = state.messages.some(m => m._id === message._id);
        if (exists) return state;
        
        return { messages: [...state.messages, message] };
      }
      return state;
    });
  },

  addChat: (chat) => {
    set((state) => {
      const exists = state.chats.some(c => c._id === chat._id);
      if (exists) return state;
      return { chats: [chat, ...state.chats] };
    });
  },

  updateChatLastMessage: (chatId, message) => {
    set((state) => ({
      chats: state.chats.map(chat => 
        chat._id === chatId 
          ? { ...chat, lastMessage: message, updatedAt: new Date().toISOString() }
          : chat
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }));
  },

  createDirectChat: async (participantId) => {
    try {
      const response = await api.post('/chats/direct', { participantId });
      const chat = response.data.data.chat;
      
      // Add to chats if not exists
      set((state) => {
        const exists = state.chats.some(c => c._id === chat._id);
        if (exists) {
          return { activeChat: chat };
        }
        return { chats: [chat, ...state.chats], activeChat: chat };
      });
      
      return { success: true, chat };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create chat'
      };
    }
  },

  createGroupChat: async (name, participantIds) => {
    try {
      const response = await api.post('/chats/group', { name, participantIds });
      const chat = response.data.data.chat;
      
      set((state) => ({
        chats: [chat, ...state.chats],
        activeChat: chat
      }));
      
      return { success: true, chat };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create group'
      };
    }
  },

  sendMessage: async (chatId, content) => {
    try {
      const response = await api.post(`/messages/chat/${chatId}`, { content });
      const message = response.data.data.message;
      
      get().addMessage(message);
      get().updateChatLastMessage(chatId, message);
      
      return { success: true, message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  sendMessageWithAttachment: async (chatId, data) => {
    try {
      const response = await api.post(`/messages/chat/${chatId}/attachment`, data);
      const message = response.data.data.message;
      
      get().addMessage(message);
      get().updateChatLastMessage(chatId, message);
      
      return { success: true, message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  markAsRead: async (chatId) => {
    try {
      await api.put(`/messages/chat/${chatId}/read`);
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  }
}));
