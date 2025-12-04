import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const variants = {
    primary: `bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 
              hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400
              text-white font-semibold shadow-lg shadow-cyan-500/25
              hover:shadow-xl hover:shadow-cyan-500/30
              border border-white/20`,
    secondary: `bg-gradient-to-r from-white/10 to-white/5 
               text-slate-200 hover:text-white 
               hover:from-white/15 hover:to-white/10
               border border-white/10 hover:border-white/20`,
    ghost: `text-slate-400 hover:text-white hover:bg-white/10 
           border border-transparent hover:border-white/10`,
    danger: `bg-gradient-to-r from-red-500 to-rose-600 
            hover:from-red-400 hover:to-rose-500 
            text-white shadow-lg shadow-red-500/25
            border border-red-400/30`
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-[1.02] active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
