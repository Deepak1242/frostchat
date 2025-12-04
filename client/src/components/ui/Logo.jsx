import { Snowflake, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'md', showText = true, animated = true }) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg', sparkle: 8 },
    md: { icon: 32, text: 'text-2xl', sparkle: 10 },
    lg: { icon: 48, text: 'text-4xl', sparkle: 14 },
    xl: { icon: 64, text: 'text-5xl', sparkle: 18 }
  };

  const { icon, text, sparkle } = sizes[size] || sizes.md;

  const iconContent = (
    <div className="relative">
      {/* Multi-layer glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 blur-xl opacity-40 animate-pulse" />
      <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30" style={{ animationDelay: '0.5s' }} />
      
      {/* Rotating ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border border-cyan-500/20"
        animate={animated ? { rotate: 360 } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      <Snowflake 
        size={icon} 
        className="relative text-transparent bg-gradient-to-br from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text" 
        strokeWidth={1.5}
        style={{ 
          filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))',
          stroke: 'url(#snowflakeGradient)'
        }}
      />
      
      {/* Sparkle accent */}
      <motion.div
        className="absolute -top-1 -right-1"
        animate={animated ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles size={sparkle} className="text-yellow-400" />
      </motion.div>
      
      {/* SVG Gradient definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="snowflakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  return (
    <div className="flex items-center gap-2.5">
      {animated ? (
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {iconContent}
        </motion.div>
      ) : (
        iconContent
      )}
      {showText && (
        <span className={`font-bold ${text}`}>
          <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent
                         drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            Frost
          </span>
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 bg-clip-text text-transparent
                         drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Chat
          </span>
        </span>
      )}
    </div>
  );
};

export default Logo;
