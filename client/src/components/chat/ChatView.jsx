import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Send,
  Paperclip,
  Image,
  Smile,
  Users
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { emitTyping } from '../../services/socket';
import { uploadFile, uploadImage } from '../../services/upload';
import Avatar from '../ui/Avatar';
import MessageList from './MessageList';
import toast from 'react-hot-toast';

const ChatView = ({ onBackClick, showBackButton }) => {
  const { user } = useAuthStore();
  const { activeChat, sendMessage, sendMessageWithAttachment, onlineUsers, typingUsers } = useChatStore();
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get display info for the chat
  const getDisplayInfo = () => {
    if (!activeChat) return { name: '', status: '' };
    
    if (activeChat.isGroupChat) {
      return {
        name: activeChat.name,
        avatar: activeChat.groupAvatar?.url,
        isGroup: true,
        memberCount: activeChat.participants.length
      };
    }
    
    const otherUser = activeChat.participants.find(p => p._id !== user?._id);
    const isOnline = otherUser && onlineUsers.includes(otherUser._id);
    
    return {
      name: otherUser?.name || otherUser?.displayName || 'Unknown User',
      avatar: otherUser?.avatar?.url,
      status: isOnline ? 'online' : otherUser?.status,
      isGroup: false
    };
  };

  const displayInfo = getDisplayInfo();

  // Get typing indicator text
  const getTypingText = () => {
    const chatTypingUsers = typingUsers[activeChat?._id] || [];
    if (chatTypingUsers.length === 0) return null;
    if (chatTypingUsers.length === 1) return `${chatTypingUsers[0].username} is typing...`;
    if (chatTypingUsers.length === 2) return `${chatTypingUsers[0].username} and ${chatTypingUsers[1].username} are typing...`;
    return 'Several people are typing...';
  };

  const typingText = getTypingText();

  // Handle typing indicator
  const handleTyping = () => {
    emitTyping(activeChat._id, true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(activeChat._id, false);
    }, 2000);
  };

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        if (activeChat?._id) {
          emitTyping(activeChat._id, false);
        }
      }
    };
  }, [activeChat?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    emitTyping(activeChat._id, false);
    
    const result = await sendMessage(activeChat._id, message.trim());
    if (result.success) {
      setMessage('');
    } else {
      toast.error('Failed to send message');
    }
    
    setIsSending(false);
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);

    try {
      let uploadResult;
      let messageType;

      if (type === 'image' && file.type.startsWith('image/')) {
        uploadResult = await uploadImage(file);
        messageType = 'image';
      } else {
        uploadResult = await uploadFile(file);
        messageType = 'file';
      }

      await sendMessageWithAttachment(activeChat._id, {
        content: '',
        attachmentUrl: uploadResult.url,
        attachmentPublicId: uploadResult.publicId,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        fileType: uploadResult.fileType,
        messageType
      });

      toast.success('File sent!');
    } catch (error) {
      toast.error('Failed to upload file');
    }

    setIsUploading(false);
    e.target.value = '';
  };

  if (!activeChat) return null;

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/90" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/10 
                     bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03] backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Back button - visible only on mobile */}
          <button
            onClick={onBackClick}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 md:hidden
                     border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          
          {displayInfo.isGroup ? (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 
                          flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-300" />
            </div>
          ) : (
            <div className="relative">
              {displayInfo.status === 'online' && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-md opacity-40" />
              )}
              <Avatar
                src={displayInfo.avatar}
                alt={displayInfo.name}
                size="md"
                className="w-10 h-10 md:w-12 md:h-12 relative"
                status={displayInfo.status}
              />
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sm md:text-base truncate text-white">{displayInfo.name}</h2>
            <p className="text-xs text-slate-400">
              {typingText ? (
                <span className="text-cyan-400 flex items-center gap-1">
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                    <span className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  </span>
                  {typingText}
                </span>
              ) : displayInfo.isGroup ? (
                <span className="text-emerald-300">{displayInfo.memberCount} members</span>
              ) : displayInfo.status === 'online' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Online
                </span>
              ) : (
                displayInfo.status
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 
                           transition-all duration-300 border border-transparent hover:border-emerald-500/30">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 
                           transition-all duration-300 border border-transparent hover:border-blue-500/30">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <div className="p-2 md:p-4 border-t border-frost-800/30">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2 md:gap-3">
          {/* Attachment buttons */}
          <div className="flex gap-0.5 md:gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, 'file')}
              className="hidden"
              accept="*/*"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-1.5 md:p-2 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-frost-300" />
            </button>
            
            <input
              type="file"
              ref={imageInputRef}
              onChange={(e) => handleFileUpload(e, 'image')}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploading}
              className="p-1.5 md:p-2 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Image className="w-4 h-4 md:w-5 md:h-5 text-frost-300" />
            </button>
          </div>

          {/* Message input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 
                          group-focus-within:opacity-100 transition-opacity duration-300" />
            <input
              type="text"
              placeholder={isUploading ? 'Uploading...' : 'Type a message...'}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              disabled={isUploading}
              className="w-full px-4 md:px-5 py-3 md:py-3.5 pr-12 md:pr-14 rounded-2xl 
                       bg-white/5 border border-white/10 focus:border-cyan-500/50
                       text-white placeholder-slate-500 text-sm md:text-base
                       transition-all duration-300 focus:bg-white/[0.08] focus:shadow-lg focus:shadow-cyan-500/10
                       relative"
            />
            <button
              type="button"
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-400 
                       transition-colors duration-300"
            >
              <Smile className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() || isSending || isUploading}
            className="p-3 md:p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 
                     hover:from-cyan-400 hover:to-blue-500
                     disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed
                     transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105
                     active:scale-95"
          >
            <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default ChatView;
