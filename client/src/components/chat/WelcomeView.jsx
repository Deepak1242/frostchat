import { motion } from 'framer-motion';
import { MessageCircle, Snowflake } from 'lucide-react';
import Logo from '../ui/Logo';

const WelcomeView = () => {
  return (
    <div className="flex-1 flex items-center justify-center glass">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md px-8"
      >
        {/* Animated Logo */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-frost-400/20 blur-3xl rounded-full animate-pulse-slow" />
          <Snowflake 
            className="w-24 h-24 text-frost-300 animate-float relative" 
            strokeWidth={1}
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Welcome to <span className="text-gradient">FrostChat</span>
        </h1>
        
        <p className="text-frost-300 mb-8">
          Select a conversation from the sidebar or start a new chat to begin messaging.
          Experience crystal clear communication with your friends and teams.
        </p>

        <div className="flex flex-col gap-4 text-left">
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-frost-500/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-frost-400" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Start a conversation</h3>
              <p className="text-xs text-frost-400">Click the + button to start chatting</p>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-frost-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-frost-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-sm">Create a group</h3>
              <p className="text-xs text-frost-400">Click the users icon to create a group chat</p>
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-8 pt-6 border-t border-frost-700/30">
          <p className="text-xs text-frost-400">
            Pro tip: Use keyboard shortcuts for faster navigation
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeView;
