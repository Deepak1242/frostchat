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
    <div className="min-h-screen py-8 px-4">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-frost-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ice-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 rounded-xl glass hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <Avatar 
                src={user?.avatar?.url} 
                alt={user?.displayName}
                size="xl"
                status={user?.status}
              />
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-frost-500 hover:bg-frost-600 cursor-pointer transition-colors">
                <Camera className="w-4 h-4" />
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
              <p className="text-sm text-frost-300">Uploading...</p>
            )}
            <h2 className="text-xl font-semibold">{user?.displayName}</h2>
            <p className="text-frost-400">@{user?.username}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-frost-400" />
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
              <label className="block text-sm font-medium text-frost-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-frost-400" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 pl-12 rounded-xl glass-input text-frost-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-frost-200 mb-2">
                Bio
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-frost-400" />
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-3 pl-12 rounded-xl glass-input text-white placeholder-frost-400 resize-none"
                />
              </div>
              <p className="text-xs text-frost-400 mt-1 text-right">
                {formData.bio.length}/200
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-frost-200 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl glass-input text-white bg-transparent"
              >
                <option value="online" className="bg-frost-900">🟢 Online</option>
                <option value="away" className="bg-frost-900">🟡 Away</option>
                <option value="busy" className="bg-frost-900">🔴 Busy</option>
                <option value="offline" className="bg-frost-900">⚫ Invisible</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
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
