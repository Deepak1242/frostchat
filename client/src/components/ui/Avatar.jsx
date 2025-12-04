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
    online: 'bg-gradient-to-br from-green-400 to-emerald-500',
    offline: 'bg-gradient-to-br from-slate-400 to-slate-500',
    away: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    busy: 'bg-gradient-to-br from-red-400 to-rose-500'
  };

  const statusGlow = {
    online: 'shadow-lg shadow-green-500/50',
    offline: '',
    away: 'shadow-lg shadow-yellow-500/50',
    busy: 'shadow-lg shadow-red-500/50'
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Gradient ring on hover */}
      <div className={`
        ${sizes[size]} 
        rounded-full 
        overflow-hidden 
        bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm
        flex items-center justify-center
        ring-2 ring-white/10 group-hover:ring-cyan-500/30
        transition-all duration-300
        shadow-lg shadow-black/20
      `}>
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
            <User className="w-1/2 h-1/2 text-slate-400" />
          </div>
        )}
      </div>
      {status && (
        <span className={`
          absolute bottom-0 right-0
          ${statusSizes[size]}
          ${statusColors[status]}
          ${statusGlow[status]}
          rounded-full
          ring-2 ring-slate-900
          ${status === 'online' ? 'animate-pulse' : ''}
        `} />
      )}
    </div>
  );
};

export default Avatar;
