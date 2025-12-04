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

  // Close sidebar on mobile when chat is selected
  useEffect(() => {
    if (activeChat && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [activeChat]);

  const handleBackToSidebar = () => {
    setIsSidebarOpen(true);
    setActiveChat(null);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Sidebar - hidden on mobile when chat is active */}
      <div className={`
        ${isSidebarOpen ? 'flex' : 'hidden'}
        md:flex
        w-full md:w-80 lg:w-96
        flex-shrink-0
        h-full
        absolute md:relative
        z-20
      `}>
        <Sidebar 
          onChatSelect={() => {
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
          }}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`
        ${!isSidebarOpen || activeChat ? 'flex' : 'hidden'}
        md:flex
        flex-1 flex-col min-w-0
        h-full
      `}>
        {activeChat ? (
          <ChatView 
            onBackClick={handleBackToSidebar}
            showBackButton={window.innerWidth < 768}
          />
        ) : (
          <WelcomeView />
        )}
      </div>
    </div>
  );
};

export default Chat;
