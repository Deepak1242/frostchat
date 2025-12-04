import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import MessageBubble from './MessageBubble';
import { Loader2 } from 'lucide-react';

const MessageList = () => {
  const { messages, isLoadingMessages, activeChat, markAsRead } = useChatStore();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (activeChat?._id && messages.length > 0) {
      markAsRead(activeChat._id);
    }
  }, [activeChat?._id, messages.length, markAsRead]);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-frost-400 animate-spin" />
          <p className="text-frost-400 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-frost-300 mb-2">No messages yet</p>
          <p className="text-frost-400 text-sm">Send a message to start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-2 md:px-4 py-2 md:py-4 space-y-3 md:space-y-4"
    >
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center gap-3 md:gap-4 my-3 md:my-4">
            <div className="flex-1 h-px bg-frost-700/30" />
            <span className="text-[10px] md:text-xs text-frost-400 font-medium whitespace-nowrap">{date}</span>
            <div className="flex-1 h-px bg-frost-700/30" />
          </div>
          
          {/* Messages */}
          <div className="space-y-2">
            {msgs.map((message, index) => {
              // Check if we should show avatar (first message from user in sequence)
              const prevMessage = index > 0 ? msgs[index - 1] : null;
              const showAvatar = !prevMessage || 
                prevMessage.sender._id !== message.sender._id ||
                message.messageType === 'system';

              return (
                <MessageBubble 
                  key={message._id} 
                  message={message}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
