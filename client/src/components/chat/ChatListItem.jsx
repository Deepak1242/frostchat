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
  
  // Check if user is online - ensure string comparison
  const isOnline = displayInfo.userId && onlineUsers.some(id => 
    String(id) === String(displayInfo.userId)
  );

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
        flex items-center gap-2 md:gap-3 p-2.5 md:p-3.5 mx-2 my-1 rounded-2xl cursor-pointer 
        transition-all duration-300 relative group
        ${isActive 
          ? 'bg-gradient-to-r from-cyan-500/20 via-teal-500/15 to-emerald-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
          : 'hover:bg-gradient-to-r hover:from-white/[0.06] hover:to-white/[0.02] active:scale-[0.98]'}
      `}
    >
      {/* Active indicator line */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-emerald-500 rounded-r-full" />
      )}
      
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {displayInfo.isGroup ? (
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 
                        flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-300" />
          </div>
        ) : (
          <div className="relative">
            {isOnline && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-md opacity-30 animate-pulse" />
            )}
            <Avatar
              src={displayInfo.avatar}
              alt={displayInfo.name}
              size="md"
              className="w-10 h-10 md:w-12 md:h-12 relative"
              status={isOnline ? 'online' : displayInfo.status}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm md:text-base truncate text-white/90 group-hover:text-white transition-colors">{displayInfo.name}</h3>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {chat.lastMessage && (
              <span className="text-[10px] md:text-xs text-slate-400">
                {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: false })}
              </span>
            )}
            {/* Unread count bubble */}
            {unreadCount > 0 && !isActive && (
              <span className="min-w-[18px] md:min-w-[20px] h-4 md:h-5 px-1.5 md:px-2 flex items-center justify-center 
                             bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] md:text-xs font-bold 
                             rounded-full shadow-lg shadow-cyan-500/30 animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs md:text-sm text-slate-400 truncate mt-0.5">
          {isTyping ? (
            <span className="text-cyan-400 flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
