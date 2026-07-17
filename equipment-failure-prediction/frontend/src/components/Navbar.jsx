import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Sun, Moon, User, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Tick clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, message: 'Equipment EQ-4001: Tool wear exceeds threshold limit.', type: 'critical', time: '5m ago' },
    { id: 2, message: 'High probability of failure predicted for Lathe B-12.', type: 'warning', time: '12m ago' },
    { id: 3, message: 'System maintenance scheduled for tonight at 23:00 UTC.', type: 'info', time: '2h ago' },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`${!darkMode ? 'Dark Mode' : 'Light Mode'} activated (Demo)`, {
      icon: !darkMode ? '🌙' : '☀️',
    });
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-6 z-10 w-full relative">
      {/* Search Container */}
      <div className="flex-grow max-w-sm">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-1.5 bg-slate-850 border border-slate-850 rounded-lg text-xs text-slate-350 placeholder-slate-500 focus:outline-none focus:border-enterprise-500 focus:ring-1 focus:ring-enterprise-500 transition-colors"
            placeholder="Search systems, models or logs..."
            onSubmit={(e) => e.preventDefault()}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Live Clock */}
        <div className="hidden lg:block text-right">
          <p className="text-[11px] font-semibold text-slate-300 tracking-wider font-mono">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-[9px] text-slate-500 font-medium">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })}
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-30">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">System Alerts</span>
                <span className="text-[10px] text-enterprise-400 hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-slate-800/40 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start">
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          notif.type === 'critical'
                            ? 'bg-red-500'
                            : notif.type === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <p className="text-xs text-slate-300 ml-2 leading-relaxed flex-grow">{notif.message}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 block text-right mt-1">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-slate-800" />

        {/* User Menu */}
        <div className="relative">
          <div
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-enterprise-600 flex items-center justify-center text-slate-100 font-bold text-xs shadow-inner">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-350">{user?.fullName || 'User'}</span>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-35">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 transition-colors text-left"
              >
                <User size={14} />
                <span>My Profile</span>
              </button>
              <div className="border-t border-slate-800 my-1" />
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 transition-colors text-left"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
