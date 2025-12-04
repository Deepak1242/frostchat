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
    <div className="min-h-screen overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-frost-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ice-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-frost-400/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 md:px-12 lg:px-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
                <Snowflake className="w-4 h-4 text-frost-400" />
                <span className="text-sm text-frost-200">Crystal Clear Communication</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Chat that's as 
                <span className="text-gradient"> cool as ice</span>
              </h1>
              <p className="text-lg text-frost-200 mb-8 max-w-xl">
                Experience seamless real-time messaging with FrostChat. Beautiful, fast, and built for modern teams and communities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="group">
                    Start Chatting Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Hero Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative glass-card p-4 shadow-glass-lg">
                {/* Chat Mockup */}
                <div className="bg-frost-950/50 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-frost-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-frost-400 to-ice-500" />
                    <div>
                      <p className="font-medium text-white">Team FrostChat</p>
                      <p className="text-xs text-frost-400">5 members online</p>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className="p-4 space-y-4 h-64">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-frost-600 flex-shrink-0" />
                      <div className="glass px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs">
                        <p className="text-sm">Hey team! The new design is live 🎉</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-frost-500/30 px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs">
                        <p className="text-sm">Looks amazing! Great work everyone</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-ice-600 flex-shrink-0" />
                      <div className="glass px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs">
                        <p className="text-sm">Let's celebrate! 🥳</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-frost-400 text-sm">
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
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-frost-400/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-ice-400/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-frost-300 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to <span className="text-gradient">stay connected</span>
            </h2>
            <p className="text-frost-300 max-w-2xl mx-auto">
              FrostChat comes packed with features designed to make your communication seamless and enjoyable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-frost-400/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-frost-500/20 flex items-center justify-center mb-4 group-hover:bg-frost-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-frost-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-frost-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 text-center frost-glow"
          >
            <Snowflake className="w-16 h-16 text-frost-400 mx-auto mb-6 animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start chatting?
            </h2>
            <p className="text-frost-300 mb-8 max-w-xl mx-auto">
              Join thousands of users who have already made the switch to FrostChat. Free forever, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-frost-400">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Free forever
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 md:px-12 lg:px-20 border-t border-frost-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-6">
              <a href="#" className="text-frost-400 hover:text-frost-200 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-frost-400 hover:text-frost-200 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-frost-400 hover:text-frost-200 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-frost-400 text-sm">
              © {new Date().getFullYear()} FrostChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
