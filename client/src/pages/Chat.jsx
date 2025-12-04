import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { initializeSocket, joinChat, leaveChat } from '../services/socket';
import Sidebar from '../components/chat/Sidebar';
import ChatView from '../components/chat/ChatView';
import WelcomeView from '../components/chat/WelcomeView';

const Chat = () => {
  const { chatId } = useParams();
  const { token } = useAuthStore();
  const { activeChat, setActiveChat, fetchChats, chats } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const socketInitialized = useRef(false);

  // Initialize socket connection - only once
  useEffect(() => {
    if (token && !socketInitialized.current) {
      socketInitialized.current = true;
      initializeSocket(token);
    }
  }, [token]);

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Handle chat from URL params
  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c._id === chatId);
      if (chat) {
        setActiveChat(chat);
      }
    }
  }, [chatId, chats, setActiveChat]);

  // Join/leave chat rooms
  useEffect(() => {
    if (activeChat?._id) {
      joinChat(activeChat._id);
    }
    return () => {
      if (activeChat?._id) {
        leaveChat(activeChat._id);
      }
    };
  }, [activeChat?._id]);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <ChatView onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        ) : (
          <WelcomeView />
        )}
      </div>
    </div>
  );
};

export default Chat;
