import { Snowflake } from 'lucide-react';

const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
    xl: { icon: 64, text: 'text-5xl' }
  };

  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-frost-400 blur-lg opacity-50 animate-pulse-slow" />
        <Snowflake 
          size={icon} 
          className="relative text-frost-300 animate-float" 
          strokeWidth={1.5}
        />
      </div>
      {showText && (
        <span className={`font-bold text-gradient ${text}`}>
          FrostChat
        </span>
      )}
    </div>
  );
};

export default Logo;
