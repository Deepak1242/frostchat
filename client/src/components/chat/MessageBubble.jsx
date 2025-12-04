import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import { Download, FileText, Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, showAvatar }) => {
  const { user } = useAuthStore();
  const isOwn = message.sender._id === user?._id;
  const isSystem = message.messageType === 'system';

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // System message
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-white/5 to-white/10 
                       border border-white/10 text-xs text-slate-400 backdrop-blur-sm">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-1.5 md:gap-2 ${isOwn ? 'flex-row-reverse' : ''} animate-in group`}>
      {/* Avatar */}
      {showAvatar && !isOwn ? (
        <div className="relative">
          <Avatar
            src={message.sender.avatar?.url}
            alt={message.sender.displayName}
            size="sm"
            className="flex-shrink-0 mt-1 w-6 h-6 md:w-8 md:h-8"
          />
        </div>
      ) : (
        <div className="w-6 md:w-8" />
      )}

      {/* Message content */}
      <div className={`max-w-[80%] md:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name for group chats */}
        {showAvatar && !isOwn && (
          <p className="text-[10px] md:text-xs text-emerald-300/70 mb-0.5 md:mb-1 ml-3 font-medium">
            {message.sender.displayName}
          </p>
        )}

        <div
          className={`
            relative rounded-2xl px-3.5 md:px-4 py-2.5 md:py-3 transition-all duration-300
            ${isOwn 
              ? 'bg-gradient-to-br from-cyan-500/30 via-teal-500/25 to-emerald-500/20 rounded-tr-md border border-cyan-500/20 shadow-lg shadow-cyan-500/5' 
              : 'bg-gradient-to-br from-white/10 to-white/5 rounded-tl-md border border-white/10 shadow-lg shadow-black/10'}
            hover:shadow-xl
          `}
        >
          {/* Image message */}
          {message.messageType === 'image' && message.attachment?.url && (
            <div className="mb-2 -mx-1 -mt-1">
              <a 
                href={message.attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl"
              >
                <img
                  src={message.attachment.url}
                  alt="Shared image"
                  className="max-w-full max-h-64 rounded-xl object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
            </div>
          )}

          {/* File message */}
          {message.messageType === 'file' && message.attachment?.url && (
            <a
              href={message.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl 
                       bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 
                       border border-white/10 transition-all duration-300 mb-2 group/file"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 
                            flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-emerald-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium truncate text-white">
                  {message.attachment.fileName || 'File'}
                </p>
                <p className="text-[10px] md:text-xs text-slate-400">
                  {formatFileSize(message.attachment.fileSize)}
                </p>
              </div>
              <Download className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover/file:text-cyan-400 
                                 flex-shrink-0 transition-colors" />
            </a>
          )}

          {/* Text content */}
          {message.content && (
            <p className={`text-sm md:text-[15px] leading-relaxed ${message.isDeleted ? 'italic text-slate-500' : 'text-white/90'}`}>
              {message.content}
            </p>
          )}

          {/* Time and status */}
          <div className={`flex items-center gap-1.5 mt-1.5 ${isOwn ? 'justify-end' : ''}`}>
            <span className="text-[10px] text-slate-500">
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
            {message.isEdited && (
              <span className="text-[10px] text-slate-500">(edited)</span>
            )}
            {isOwn && (
              <span className={message.readBy?.length > 0 ? 'text-cyan-400' : 'text-slate-500'}>
                {message.readBy?.length > 0 ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
