import { User } from 'lucide-react';

const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  status,
  className = '' 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  };

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`
        ${sizes[size]} 
        rounded-full 
        overflow-hidden 
        glass 
        flex items-center justify-center
        ring-2 ring-frost-400/20
      `}>
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-1/2 h-1/2 text-frost-300" />
        )}
      </div>
      {status && (
        <span className={`
          absolute bottom-0 right-0
          ${statusSizes[size]}
          ${statusColors[status]}
          rounded-full
          ring-2 ring-frost-900
        `} />
      )}
    </div>
  );
};

export default Avatar;
