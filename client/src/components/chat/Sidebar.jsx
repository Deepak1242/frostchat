import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Users, 
  Settings, 
  Menu,
  X,
  MessageCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import api from '../../services/api';
import Avatar from '../ui/Avatar';
import Logo from '../ui/Logo';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ChatListItem from './ChatListItem';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { chats, isLoadingChats, setActiveChat, createDirectChat, createGroupChat } = useChatStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch users for new chat
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/all');
        setUsers(response.data.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Filter chats based on search
  const filteredChats = chats.filter(chat => {
    const searchLower = searchQuery.toLowerCase();
    if (chat.isGroupChat) {
      return chat.name?.toLowerCase().includes(searchLower);
    }
    const otherUser = chat.participants.find(p => p._id !== user?._id);
    return otherUser?.displayName?.toLowerCase().includes(searchLower) ||
           otherUser?.username?.toLowerCase().includes(searchLower);
  });

  const handleStartChat = async (userId) => {
    setIsCreating(true);
    const result = await createDirectChat(userId);
    if (result.success) {
      setIsNewChatModalOpen(false);
      navigate(`/chat/${result.chat._id}`);
    } else {
      toast.error(result.message);
    }
    setIsCreating(false);
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

    setIsCreating(true);
    const result = await createGroupChat(groupName, selectedUsers);
    if (result.success) {
      setIsGroupModalOpen(false);
      setGroupName('');
      setSelectedUsers([]);
      navigate(`/chat/${result.chat._id}`);
    } else {
      toast.error(result.message);
    }
    setIsCreating(false);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-30
        w-80 flex flex-col
        glass border-r border-frost-800/30
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-frost-800/30">
          <div className="flex items-center justify-between mb-4">
            <Logo size="sm" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                title="New Chat"
              >
                <Plus className="w-5 h-5 text-frost-300" />
              </button>
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                title="New Group"
              >
                <Users className="w-5 h-5 text-frost-300" />
              </button>
              <button
                onClick={onToggle}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors lg:hidden"
              >
                <X className="w-5 h-5 text-frost-300" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frost-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto py-2">
          {isLoadingChats ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-frost-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-frost-400">
              <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            filteredChats.map(chat => (
              <ChatListItem 
                key={chat._id} 
                chat={chat}
                onClick={() => {
                  setActiveChat(chat);
                  navigate(`/chat/${chat._id}`);
                  if (window.innerWidth < 1024) onToggle();
                }}
              />
            ))
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-frost-800/30">
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
          >
            <Avatar 
              src={user?.avatar?.url} 
              alt={user?.displayName}
              size="sm"
              status={user?.status}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.displayName}</p>
              <p className="text-xs text-frost-400 truncate">@{user?.username}</p>
            </div>
            <Settings className="w-4 h-4 text-frost-400" />
          </div>
        </div>
      </aside>

      {/* New Chat Modal */}
      <Modal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        title="Start New Chat"
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {users.map(u => (
            <div
              key={u._id}
              onClick={() => !isCreating && handleStartChat(u._id)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Avatar 
                src={u.avatar?.url} 
                alt={u.displayName}
                size="sm"
                status={u.status}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{u.displayName}</p>
                <p className="text-xs text-frost-400 truncate">@{u.username}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Create Group Modal */}
      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setGroupName('');
          setSelectedUsers([]);
        }}
        title="Create Group Chat"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          
          <div>
            <p className="text-sm text-frost-300 mb-2">
              Select members ({selectedUsers.length} selected)
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.map(u => (
                <div
                  key={u._id}
                  onClick={() => toggleUserSelection(u._id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
                    ${selectedUsers.includes(u._id) 
                      ? 'bg-frost-500/20 border border-frost-500/50' 
                      : 'hover:bg-white/5'}
                  `}
                >
                  <Avatar 
                    src={u.avatar?.url} 
                    alt={u.displayName}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{u.displayName}</p>
                    <p className="text-xs text-frost-400 truncate">@{u.username}</p>
                  </div>
                  {selectedUsers.includes(u._id) && (
                    <div className="w-5 h-5 rounded-full bg-frost-500 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreateGroup}
            isLoading={isCreating}
            className="w-full"
          >
            Create Group
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
