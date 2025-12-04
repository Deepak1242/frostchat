import { motion } from 'framer-motion';
import { MessageCircle, Snowflake, Users, Sparkles } from 'lucide-react';
import Logo from '../ui/Logo';

const WelcomeView = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/90" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg px-4 md:px-8 relative z-10"
      >
        {/* Animated Logo */}
        <div className="relative inline-block mb-8 md:mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-emerald-500/30 blur-3xl rounded-full animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-cyan-500/20 blur-2xl rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Snowflake 
              className="w-20 h-20 md:w-28 md:h-28 text-cyan-300" 
              strokeWidth={1}
            />
          </motion.div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-5">
          Welcome to <span className="text-gradient">FrostChat</span>
        </h1>
        
        <p className="text-slate-400 mb-8 md:mb-10 text-sm md:text-base leading-relaxed">
          Select a conversation from the sidebar or start a new chat to begin messaging.
          Experience crystal clear communication with your friends and teams.
        </p>

        <div className="flex flex-col gap-4 md:gap-5 text-left">
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            className="p-4 md:p-5 flex items-center gap-4 md:gap-5 rounded-2xl
                     bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent
                     border border-cyan-500/20 hover:border-cyan-500/40
                     transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 
                          flex items-center justify-center flex-shrink-0 border border-cyan-500/30
                          group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300">
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm md:text-base text-white">Start a conversation</h3>
              <p className="text-xs md:text-sm text-slate-400">Click the + button to start chatting</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            className="p-4 md:p-5 flex items-center gap-4 md:gap-5 rounded-2xl
                     bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent
                     border border-emerald-500/20 hover:border-emerald-500/40
                     transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 
                          flex items-center justify-center flex-shrink-0 border border-emerald-500/30
                          group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm md:text-base text-white">Create a group</h3>
              <p className="text-xs md:text-sm text-slate-400">Click the users icon to create a group chat</p>
            </div>
          </motion.div>
        </div>

        {/* Keyboard shortcuts hint - hidden on mobile */}
        <div className="hidden md:block mt-10 pt-6 border-t border-slate-700/30">
          <p className="text-xs text-slate-500">
            ✨ Pro tip: Use keyboard shortcuts for faster navigation
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeView;
