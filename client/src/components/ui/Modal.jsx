import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with gradient overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-slate-900/60 to-emerald-900/30 backdrop-blur-md z-[9998]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className={`
              fixed inset-0 flex items-center justify-center z-[9999] p-2 md:p-4 pointer-events-none
            `}
          >
            <div className={`
              relative w-full ${sizes[size]} p-4 md:p-6
              bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-emerald-950/80
              border border-white/10
              rounded-3xl shadow-2xl
              shadow-cyan-500/5
              max-h-[90vh] md:max-h-[85vh] overflow-y-auto
              pointer-events-auto
              mx-2 md:mx-0
              backdrop-blur-xl
            `}>
              {/* Decorative gradient orbs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-full" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4 md:mb-5 relative">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 
                           hover:border-red-500/30 transition-all duration-300 group"
                >
                  <X className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
              
              {/* Content */}
              <div className="relative">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document body level
  return createPortal(modalContent, document.body);
};

export default Modal;
