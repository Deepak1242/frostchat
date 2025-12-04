import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Camera, 
  Save, 
  LogOut,
  User,
  Mail,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { uploadAvatar } from '../services/upload';
import api from '../services/api';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    status: user?.status || 'online'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadAvatar(file);
      updateUser({ avatar: result.user.avatar });
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to update avatar');
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data.data.user);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen py-4 md:py-8 px-3 md:px-4
                  bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-emerald-500/15 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <button
            onClick={() => navigate('/chat')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 
                     hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Profile Settings
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-4 md:p-6 lg:p-8 rounded-3xl overflow-hidden
                    bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-900/20
                    border border-white/10 backdrop-blur-xl
                    shadow-2xl shadow-emerald-500/5"
        >
          {/* Decorative orbs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-full" />
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6 md:mb-8 relative">
            <div className="relative mb-3 md:mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-emerald-500/30 blur-2xl rounded-full" />
              <Avatar 
                src={user?.avatar?.url} 
                alt={user?.displayName}
                size="xl"
                className="w-20 h-20 md:w-24 md:h-24"
                status={user?.status}
              />
              <label className="absolute bottom-0 right-0 p-1.5 md:p-2 rounded-full 
                              bg-gradient-to-r from-cyan-500 to-emerald-500 
                              hover:from-cyan-400 hover:to-emerald-400 
                              cursor-pointer transition-all duration-300 shadow-lg shadow-emerald-500/20">
                <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            {isUploading && (
              <p className="text-xs md:text-sm text-cyan-400 animate-pulse">Uploading...</p>
            )}
            <h2 className="text-lg md:text-xl font-semibold text-white">{user?.displayName}</h2>
            <p className="text-sm md:text-base text-slate-400">@{user?.username}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 z-10" />
              <Input
                name="displayName"
                type="text"
                placeholder="Display Name"
                value={formData.displayName}
                onChange={handleChange}
                className="pl-12"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 z-10" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3.5 pl-12 rounded-2xl bg-white/5 border border-white/5 
                           text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bio
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 
                              rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <FileText className="absolute left-4 top-4 w-5 h-5 text-emerald-400 z-10" />
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  className="relative w-full px-4 py-3 pl-12 rounded-2xl bg-white/5 border border-white/10 
                           text-white placeholder-slate-500 resize-none
                           focus:bg-white/[0.08] focus:border-cyan-500/50 focus:outline-none
                           focus:shadow-lg focus:shadow-emerald-500/10 transition-all duration-300"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1 text-right">
                {formData.bio.length}/200
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 
                         text-white focus:border-cyan-500/50 focus:outline-none
                         focus:shadow-lg focus:shadow-cyan-500/10 transition-all duration-300"
              >
                <option value="online" className="bg-slate-900">🟢 Online</option>
                <option value="away" className="bg-slate-900">🟡 Away</option>
                <option value="busy" className="bg-slate-900">🔴 Busy</option>
                <option value="offline" className="bg-slate-900">⚫ Invisible</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleLogout}
                className="flex-1 sm:flex-none"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
