import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Cpu,
  Activity,
  UploadCloud,
  BarChart3,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Equipment', path: '/equipment', icon: Cpu },
    { name: 'Prediction', path: '/prediction', icon: Activity },
    { name: 'CSV Upload', path: '/csv-upload', icon: UploadCloud },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Maintenance History', path: '/maintenance-history', icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? '72px' : '260px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between relative z-20 select-none flex-shrink-0"
    >
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-850 h-16">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 text-enterprise-400 font-bold text-lg tracking-wider"
            >
              <Cpu size={24} className="text-enterprise-500 animate-pulse" />
              <span>SENSORA</span>
            </motion.div>
          )}
          {isCollapsed && (
            <Cpu size={24} className="text-enterprise-500 mx-auto animate-pulse" />
          )}

          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-5 -right-3 p-1 rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors z-30"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="mt-6 px-3 space-y-1.5 flex-grow">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-enterprise-600/20 border-l-2 border-enterprise-500 text-enterprise-400'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-250 border-l-2 border-transparent'
                  }`
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-850 bg-slate-950/20 space-y-2">
        {/* User Card */}
        {!isCollapsed && (
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-enterprise-700 flex items-center justify-center text-slate-100 font-bold text-xs shadow-inner">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="truncate flex-grow">
              <h4 className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.fullName || 'User'}
              </h4>
              <p className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all border-l-2 border-transparent"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="truncate"
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
