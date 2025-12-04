import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiLogOut, FiUsers, FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ChatListItem from './ChatListItem';
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import api from '../../services/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { chats, activeChat, setChats, setActiveChat, unreadCounts } = useChatStore();
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [isGroupSearching, setIsGroupSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get('/chats');
        setChats(res.data);
      } catch (error) {
        toast.error('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [setChats]);

  // Search users by username (debounced)
  const searchUsers = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      // Filter out current user
      const filtered = res.data.filter(u => u._id !== user._id);
      setSearchResults(filtered);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  }, [user._id]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showNewChatModal) {
        searchUsers(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers, showNewChatModal]);

  // Search users for group (debounced)
  const searchUsersForGroup = useCallback(async (query) => {
    if (!query.trim()) {
      setGroupSearchResults([]);
      return;
    }

    setIsGroupSearching(true);
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      // Filter out current user and already selected users
      const selectedIds = selectedUsers.map(u => u._id);
      const filtered = res.data.filter(u => u._id !== user._id && !selectedIds.includes(u._id));
      setGroupSearchResults(filtered);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsGroupSearching(false);
    }
  }, [user._id, selectedUsers]);

  // Debounce group search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showGroupModal) {
        searchUsersForGroup(groupSearchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [groupSearchQuery, searchUsersForGroup, showGroupModal]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartChat = async (selectedUser) => {
    try {
      const res = await api.post('/chats', {
        userId: selectedUser._id
      });
      
      // Add to chats if not already present
      const chatExists = chats.find(c => c._id === res.data._id);
      if (!chatExists) {
        setChats([res.data, ...chats]);
      }
      
      setActiveChat(res.data);
      setShowNewChatModal(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      toast.error('Failed to create chat');
    }
  };

  const handleSelectUser = (selectedUser) => {
    setSelectedUsers([...selectedUsers, selectedUser]);
    setGroupSearchQuery('');
    setGroupSearchResults([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    if (selectedUsers.length < 2) {
      toast.error('Please select at least 2 members');
      return;
    }

    try {
      const res = await api.post('/chats/group', {
        name: groupName,
        members: selectedUsers.map(u => u._id)
      });
      
      setChats([res.data, ...chats]);
      setActiveChat(res.data);
      setShowGroupModal(false);
      setGroupName('');
      setSelectedUsers([]);
      setGroupSearchQuery('');
      setGroupSearchResults([]);
      toast.success('Group created!');
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const closeNewChatModal = () => {
    setShowNewChatModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const closeGroupModal = () => {
    setShowGroupModal(false);
    setGroupName('');
    setSelectedUsers([]);
    setGroupSearchQuery('');
    setGroupSearchResults([]);
  };

  return (
    <div className="w-80 h-full flex flex-col glass border-r border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 rounded-lg bg-frost-400/20 hover:bg-frost-400/30 
                       text-frost-300 transition-colors"
              title="New Chat"
            >
              <FiPlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowGroupModal(true)}
              className="p-2 rounded-lg bg-frost-400/20 hover:bg-frost-400/30 
                       text-frost-300 transition-colors"
              title="New Group"
            >
              <FiUsers className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* User Profile */}
        <Link 
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Avatar 
            src={user?.avatar} 
            name={user?.name} 
            size="md"
            showStatus
            isOnline={true}
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{user?.name}</p>
            <p className="text-frost-300 text-sm truncate">{user?.status || 'Available'}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 
                     hover:text-red-400 transition-colors"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-frost-400 border-t-transparent 
                          rounded-full animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <p>No chats yet</p>
            <p className="text-sm">Click + to start a conversation</p>
          </div>
        ) : (
          <AnimatePresence>
            {chats.map((chat, index) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ChatListItem
                  chat={chat}
                  isActive={activeChat?._id === chat._id}
                  onClick={() => setActiveChat(chat)}
                  currentUserId={user._id}
                  unreadCount={unreadCounts[chat._id] || 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* New Chat Modal - Search Based */}
      <Modal
        isOpen={showNewChatModal}
        onClose={closeNewChatModal}
        title="Start New Chat"
      >
        <div className="space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username..."
              className="w-full pl-10 pr-4 py-3 bg-dark-700/50 border border-white/10 
                       rounded-lg text-white placeholder-gray-400 focus:outline-none 
                       focus:border-frost-400/50 transition-colors"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-frost-400 border-t-transparent 
                              rounded-full animate-spin" />
              </div>
            ) : searchQuery.trim() === '' ? (
              <p className="text-center text-gray-400 py-8">
                Enter a username to search
              </p>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No users found
              </p>
            ) : (
              searchResults.map(u => (
                <button
                  key={u._id}
                  onClick={() => handleStartChat(u)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg 
                           hover:bg-frost-400/10 transition-colors"
                >
                  <Avatar 
                    src={u.avatar} 
                    name={u.name} 
                    size="md"
                    showStatus
                    isOnline={u.isOnline}
                  />
                  <div className="text-left">
                    <p className="text-white font-medium">{u.name}</p>
                    <p className="text-gray-400 text-sm">@{u.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Group Chat Modal - Search Based */}
      <Modal
        isOpen={showGroupModal}
        onClose={closeGroupModal}
        title="Create Group"
      >
        <div className="space-y-4">
          <Input
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(u => (
                <span
                  key={u._id}
                  className="flex items-center gap-1 px-2 py-1 bg-frost-400/20 
                           rounded-full text-sm text-frost-300"
                >
                  {u.name}
                  <button
                    onClick={() => handleRemoveUser(u._id)}
                    className="hover:text-white"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search for group members */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={groupSearchQuery}
              onChange={(e) => setGroupSearchQuery(e.target.value)}
              placeholder="Search users to add..."
              className="w-full pl-10 pr-4 py-3 bg-dark-700/50 border border-white/10 
                       rounded-lg text-white placeholder-gray-400 focus:outline-none 
                       focus:border-frost-400/50 transition-colors"
            />
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2">
            {isGroupSearching ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-frost-400 border-t-transparent 
                              rounded-full animate-spin" />
              </div>
            ) : groupSearchQuery.trim() === '' ? (
              <p className="text-center text-gray-400 py-4 text-sm">
                Search for users to add
              </p>
            ) : groupSearchResults.length === 0 ? (
              <p className="text-center text-gray-400 py-4 text-sm">
                No users found
              </p>
            ) : (
              groupSearchResults.map(u => (
                <button
                  key={u._id}
                  onClick={() => handleSelectUser(u)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg 
                           hover:bg-frost-400/10 transition-colors"
                >
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <div className="text-left">
                    <p className="text-white text-sm">{u.name}</p>
                    <p className="text-gray-400 text-xs">@{u.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <Button onClick={handleCreateGroup} className="w-full">
            Create Group ({selectedUsers.length} members)
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
