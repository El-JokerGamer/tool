import React from 'react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'country', label: 'اقتصاد بلدي', icon: 'fa-solid fa-flag', badge: null },
    { id: 'global', label: 'الاقتصاد العالمي', icon: 'fa-solid fa-globe', badge: null },
    { id: 'market', label: 'السوق', icon: 'fa-solid fa-store', badge: 'جديد' },
    { id: 'jobs', label: 'سوق العمل', icon: 'fa-solid fa-briefcase', badge: null },
    { id: 'treasury', label: 'الخزينة', icon: 'fa-solid fa-vault', badge: null },
    ...(user?.role === 'owner' ? [{ id: 'admin', label: 'لوحة التحكم', icon: 'fa-solid fa-shield-halved', badge: null }] : []),
  ];

  return (
    <aside className="w-64 h-screen fixed right-0 top-0 glass-card border-l border-indigo-500/20 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
            <i className="fa-solid fa-chart-line text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">Eclesiar</h1>
            <p className="text-xs text-slate-400">لوحة الاقتصاد</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-bold">
            {user?.username?.charAt(0) || '؟'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username || 'ضيف'}</p>
            <p className="text-xs text-slate-400">{user?.countryFlag} {user?.country || '-'}</p>
          </div>
          {user?.role === 'owner' && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
              👑 مالك
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <i className={`${item.icon} w-5 text-center`}></i>
            <span className="flex-1 text-right">{item.label}</span>
            {item.badge && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-indigo-500/20">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
