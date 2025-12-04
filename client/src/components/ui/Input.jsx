import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 
                      rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <input
          ref={ref}
          className={`
            relative w-full px-5 py-3.5 rounded-2xl
            bg-white/5 border border-white/10
            text-white placeholder-slate-500
            focus:bg-white/[0.08] focus:border-cyan-500/50 focus:outline-none
            focus:shadow-lg focus:shadow-cyan-500/10
            transition-all duration-300
            ${error ? 'border-red-500/50 focus:border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
