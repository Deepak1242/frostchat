import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Shield, 
  Zap, 
  Image, 
  Bell,
  ArrowRight,
  Check,
  Snowflake,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

const Landing = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Messaging',
      description: 'Instant message delivery with typing indicators and read receipts.'
    },
    {
      icon: Users,
      title: 'Group Chats',
      description: 'Create group conversations with friends, family, or colleagues.'
    },
    {
      icon: Image,
      title: 'Media Sharing',
      description: 'Share images, videos, and files seamlessly in your chats.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your messages are protected with industry-standard encryption.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built on modern infrastructure for blazing fast performance.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Stay informed with intelligent notification management.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '1M+', label: 'Messages Sent' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-40 md:w-80 h-40 md:h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-32 md:w-64 h-32 md:h-64 bg-teal-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/3 w-24 md:w-48 h-24 md:h-48 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 lg:px-20 
                     backdrop-blur-md bg-slate-900/30 border-b border-white/5">
        <Logo size="sm" className="md:text-base" />
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-sm md:text-base px-3 md:px-4">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button className="text-sm md:text-base px-3 md:px-4">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20 lg:px-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 
                            bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-teal-500/10
                            border border-white/10 rounded-full mb-4 md:mb-6
                            shadow-lg shadow-cyan-500/5">
                <Snowflake className="w-3 h-3 md:w-4 md:h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-xs md:text-sm bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent font-medium">
                  Crystal Clear Communication
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Chat that's as 
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent"> cool as ice</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 mb-6 md:mb-8 max-w-xl">
                Experience seamless real-time messaging with FrostChat. Beautiful, fast, and built for modern teams and communities.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                <Link to="/register">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Start Chatting Free
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Hero Mockup - hidden on very small screens */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden sm:block"
            >
              <div className="relative glass-card p-3 md:p-4 shadow-glass-lg">
                {/* Chat Mockup */}
                <div className="bg-frost-950/50 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-b border-frost-800/50">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-frost-400 to-ice-500" />
                    <div>
                      <p className="font-medium text-sm md:text-base text-white">Team FrostChat</p>
                      <p className="text-[10px] md:text-xs text-frost-400">5 members online</p>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className="p-3 md:p-4 space-y-3 md:space-y-4 h-48 md:h-64">
                    <div className="flex gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-frost-600 flex-shrink-0" />
                      <div className="glass px-3 md:px-4 py-1.5 md:py-2 rounded-2xl rounded-tl-sm max-w-xs">
                        <p className="text-xs md:text-sm">Hey team! The new design is live 🎉</p>
                      </div>
                    </div>
                    <div className="flex gap-2 md:gap-3 justify-end">
                      <div className="bg-frost-500/30 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl rounded-tr-sm max-w-xs">
                        <p className="text-xs md:text-sm">Looks amazing! Great work everyone</p>
                      </div>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-ice-600 flex-shrink-0" />
                      <div className="glass px-3 md:px-4 py-1.5 md:py-2 rounded-2xl rounded-tl-sm max-w-xs">
                        <p className="text-xs md:text-sm">Let's celebrate! 🥳</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-frost-400 text-xs md:text-sm">
                      <span className="flex gap-1">
                        <span className="w-1 h-1 bg-frost-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-frost-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-frost-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                      Sarah is typing...
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 md:w-24 h-16 md:h-24 bg-frost-400/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-20 md:w-32 h-20 md:h-32 bg-ice-400/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 md:px-6 py-10 md:py-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative p-6 md:p-8 lg:p-12 rounded-3xl overflow-hidden
                        bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-emerald-900/20
                        border border-white/10 backdrop-blur-xl
                        shadow-2xl shadow-cyan-500/5">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-4 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 md:px-6 py-12 md:py-20 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Everything you need to <span className="text-gradient">stay connected</span>
            </h2>
            <p className="text-sm md:text-base text-frost-300 max-w-2xl mx-auto">
              FrostChat comes packed with features designed to make your communication seamless and enjoyable.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-4 md:p-6 rounded-2xl overflow-hidden
                         bg-gradient-to-br from-slate-900/80 to-slate-900/40
                         border border-white/10 hover:border-cyan-500/30
                         transition-all duration-300 group
                         hover:shadow-lg hover:shadow-cyan-500/10"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl 
                                bg-gradient-to-br from-cyan-500/20 to-emerald-500/20
                                flex items-center justify-center mb-3 md:mb-4 
                                group-hover:shadow-lg group-hover:shadow-cyan-500/20 
                                transition-all duration-300 border border-white/5">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1.5 md:mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm md:text-base text-slate-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-5 md:p-8 lg:p-12 text-center rounded-3xl overflow-hidden
                     bg-gradient-to-br from-slate-900/90 via-emerald-900/20 to-cyan-900/20
                     border border-white/10
                     shadow-2xl shadow-emerald-500/10"
          >
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-teal-500/20 blur-xl opacity-50" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            <div className="relative">
              <div className="relative inline-block mb-4 md:mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-emerald-500/30 blur-2xl rounded-full animate-pulse" />
                <Snowflake className="w-12 h-12 md:w-16 md:h-16 text-cyan-400 mx-auto animate-float relative" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-white">
                Ready to start chatting?
              </h2>
              <p className="text-sm md:text-base text-slate-400 mb-6 md:mb-8 max-w-xl mx-auto">
                Join thousands of users who have already made the switch to FrostChat. Free forever, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Free Account
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8 text-xs md:text-sm text-slate-400">
                <span className="flex items-center gap-1.5 md:gap-2">
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                  Free forever
                </span>
                <span className="flex items-center gap-1.5 md:gap-2">
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5 md:gap-2">
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-6 py-8 md:py-12 lg:px-20 
                       border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} FrostChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
