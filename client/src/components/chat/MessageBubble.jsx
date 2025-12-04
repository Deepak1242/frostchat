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
        <span className="px-4 py-1.5 rounded-full glass text-xs text-frost-300">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''} animate-in`}>
      {/* Avatar */}
      {showAvatar && !isOwn ? (
        <Avatar
          src={message.sender.avatar?.url}
          alt={message.sender.displayName}
          size="sm"
          className="flex-shrink-0 mt-1"
        />
      ) : (
        <div className="w-8" />
      )}

      {/* Message content */}
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name for group chats */}
        {showAvatar && !isOwn && (
          <p className="text-xs text-frost-400 mb-1 ml-1">
            {message.sender.displayName}
          </p>
        )}

        <div
          className={`
            relative rounded-2xl px-4 py-2.5
            ${isOwn 
              ? 'bg-frost-500/30 rounded-tr-sm' 
              : 'glass rounded-tl-sm'}
          `}
        >
          {/* Image message */}
          {message.messageType === 'image' && message.attachment?.url && (
            <div className="mb-2">
              <a 
                href={message.attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={message.attachment.url}
                  alt="Shared image"
                  className="max-w-full max-h-64 rounded-lg object-cover hover:opacity-90 transition-opacity"
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
              className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-white/10 transition-colors mb-2"
            >
              <div className="w-10 h-10 rounded-lg bg-frost-500/30 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-frost-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {message.attachment.fileName || 'File'}
                </p>
                <p className="text-xs text-frost-400">
                  {formatFileSize(message.attachment.fileSize)}
                </p>
              </div>
              <Download className="w-5 h-5 text-frost-300 flex-shrink-0" />
            </a>
          )}

          {/* Text content */}
          {message.content && (
            <p className={`text-sm ${message.isDeleted ? 'italic text-frost-400' : ''}`}>
              {message.content}
            </p>
          )}

          {/* Time and status */}
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
            <span className="text-[10px] text-frost-400">
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
            {message.isEdited && (
              <span className="text-[10px] text-frost-400">(edited)</span>
            )}
            {isOwn && (
              <span className="text-frost-300">
                {message.readBy?.length > 0 ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
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
