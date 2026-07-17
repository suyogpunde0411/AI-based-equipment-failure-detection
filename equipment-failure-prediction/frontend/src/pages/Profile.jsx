import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Mail, Shield, LogOut, CheckCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Banner toolbar */}
      <div className="border-b border-slate-850 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">User Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage system registry roles, authentication credentials, and user data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side avatar block */}
        <div className="md:col-span-1">
          <Card className="flex flex-col items-center justify-center text-center p-6 border border-slate-800/80">
            <div className="w-20 h-20 rounded-full bg-enterprise-700 flex items-center justify-center text-slate-100 font-extrabold text-2xl shadow-xl ring-4 ring-enterprise-950">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <h2 className="text-base font-bold text-slate-200 mt-4">{user?.fullName || 'User'}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-enterprise-950/20 border-enterprise-900 text-enterprise-400 mt-2 uppercase tracking-widest">
              {user?.role || 'ENGINEER'}
            </span>

            <div className="w-full border-t border-slate-850 my-6" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-950/20 hover:bg-red-900 hover:text-white border border-red-900/30 text-red-400 rounded-lg text-xs font-bold transition-all focus:outline-none"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </Card>
        </div>

        {/* Right Side Info list */}
        <div className="md:col-span-2">
          <Card title="System Authorization Details" icon={Award} className="border border-slate-800/80">
            <div className="space-y-6 mt-4">
              {/* Name Details */}
              <div className="flex items-start space-x-3.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full User Registry Name</h4>
                  <p className="text-sm font-semibold text-slate-250 mt-1">{user?.fullName || 'N/A'}</p>
                </div>
              </div>

              {/* Email Details */}
              <div className="flex items-start space-x-3.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Email Address</h4>
                  <p className="text-sm font-semibold text-slate-250 mt-1">{user?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Role Details */}
              <div className="flex items-start space-x-3.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                  <Shield size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operational Registry Access Role</h4>
                  <p className="text-sm font-semibold text-slate-250 mt-1">{user?.role || 'N/A'}</p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-start space-x-3.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-450">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Device Integration Status</h4>
                  <p className="text-sm font-semibold text-emerald-400 mt-1">Verified - Active Node Connection</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
