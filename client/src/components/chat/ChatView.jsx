import { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
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

const ChatView = ({ onMenuClick }) => {
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
    <div className="flex flex-col h-full glass">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-frost-800/30">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {displayInfo.isGroup ? (
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center ring-2 ring-frost-400/20">
              <Users className="w-5 h-5 text-frost-300" />
            </div>
          ) : (
            <Avatar
              src={displayInfo.avatar}
              alt={displayInfo.name}
              size="md"
              status={displayInfo.status}
            />
          )}
          
          <div>
            <h2 className="font-semibold">{displayInfo.name}</h2>
            <p className="text-xs text-frost-400">
              {typingText ? (
                <span className="text-frost-300">{typingText}</span>
              ) : displayInfo.isGroup ? (
                `${displayInfo.memberCount} members`
              ) : displayInfo.status === 'online' ? (
                <span className="text-green-400">Online</span>
              ) : (
                displayInfo.status
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <Phone className="w-5 h-5 text-frost-300" />
          </button>
          <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <Video className="w-5 h-5 text-frost-300" />
          </button>
          <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-frost-300" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <div className="p-4 border-t border-frost-800/30">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          {/* Attachment buttons */}
          <div className="flex gap-1">
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
              className="p-2 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Paperclip className="w-5 h-5 text-frost-300" />
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
              className="p-2 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Image className="w-5 h-5 text-frost-300" />
            </button>
          </div>

          {/* Message input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={isUploading ? 'Uploading...' : 'Type a message...'}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              disabled={isUploading}
              className="w-full px-4 py-3 pr-12 rounded-xl glass-input text-white placeholder-frost-400"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-frost-400 hover:text-frost-200"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() || isSending || isUploading}
            className="p-3 rounded-xl glass-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
