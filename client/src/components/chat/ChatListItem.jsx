import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import Avatar from '../ui/Avatar';
import { Users, Image, FileText } from 'lucide-react';

const ChatListItem = ({ chat, onClick, unreadCount = 0 }) => {
  const { user } = useAuthStore();
  const { activeChat, onlineUsers, typingUsers } = useChatStore();
  const isActive = activeChat?._id === chat._id;

  // Get display info for the chat l !! 
  const getDisplayInfo = () => {
    if (chat.isGroupChat) {
      return {
        name: chat.name,
        avatar: chat.groupAvatar?.url,
        isGroup: true
      };
    }
    const otherUser = chat.participants.find(p => p._id !== user?._id);
    return {
      name: otherUser?.name || otherUser?.displayName || 'Unknown User',
      avatar: otherUser?.avatar?.url,
      status: otherUser?.status,
      userId: otherUser?._id,
      isGroup: false
    };
  };

  const displayInfo = getDisplayInfo();
  const isOnline = displayInfo.userId && onlineUsers.includes(displayInfo.userId);

  // Get last message preview
  const getLastMessagePreview = () => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const msg = chat.lastMessage;
    if (msg.messageType === 'image') return '📷 Image';
    if (msg.messageType === 'file') return '📎 File';
    if (msg.isDeleted) return 'Message deleted';
    
    const content = msg.content || '';
    const senderName = msg.sender?._id === user?._id 
      ? 'You' 
      : (msg.sender?.name || msg.sender?.displayName)?.split(' ')[0];
    
    return chat.isGroupChat 
      ? `${senderName}: ${content}`
      : content;
  };

  // Check if someone is typing
  const chatTypingUsers = typingUsers[chat._id] || [];
  const isTyping = chatTypingUsers.length > 0;

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 mx-2 rounded-xl cursor-pointer transition-all
        ${isActive 
          ? 'bg-frost-500/20 border border-frost-500/30' 
          : 'hover:bg-white/5'}
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {displayInfo.isGroup ? (
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center ring-2 ring-frost-400/20">
            <Users className="w-6 h-6 text-frost-300" />
          </div>
        ) : (
          <Avatar
            src={displayInfo.avatar}
            alt={displayInfo.name}
            size="lg"
            status={isOnline ? 'online' : displayInfo.status}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium truncate">{displayInfo.name}</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {chat.lastMessage && (
              <span className="text-xs text-frost-400">
                {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: false })}
              </span>
            )}
            {/* Unread count bubble */}
            {unreadCount > 0 && !isActive && (
              <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center 
                             bg-frost-500 text-white text-xs font-bold rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-frost-400 truncate">
          {isTyping ? (
            <span className="text-frost-300 flex items-center gap-1">
              <span className="flex gap-0.5">
                <span className="w-1 h-1 bg-frost-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-frost-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-frost-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              {chatTypingUsers.length === 1 
                ? `${chatTypingUsers[0].username} is typing...`
                : 'Several people are typing...'}
            </span>
          ) : (
            getLastMessagePreview()
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatListItem;
