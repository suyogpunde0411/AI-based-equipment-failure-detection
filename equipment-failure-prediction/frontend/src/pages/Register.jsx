import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Cpu, Mail, Lock, User, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register = () => {
  const { register: registerApi, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'ENGINEER'
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerApi(data.fullName, data.email, data.password, data.role);
    setLoading(false);

    if (result.success) {
      toast.success(result.message || 'Registration successful! Please login.');
      navigate('/login');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-enterprise-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md animate-fade-in"
      >
        {/* Logo brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-enterprise-400 shadow-xl mb-3">
            <Cpu size={32} className="text-enterprise-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wider">SENSORA INDUSTRIAL</h2>
          <p className="text-xs text-slate-400 mt-1">Register New System Account</p>
        </div>

        {/* Card Form container */}
        <div className="glassmorphism rounded-2xl p-8 shadow-2xl relative border border-slate-800/80">
          <h3 className="text-lg font-semibold text-slate-200 mb-6 text-center">System Registry</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-2 bg-slate-950/80 border ${
                    errors.fullName ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-enterprise-500'
                  } rounded-lg text-sm text-slate-250 focus:outline-none focus:ring-1 focus:ring-enterprise-500 transition-colors`}
                  placeholder="John Doe"
                  {...register('fullName', { required: 'Full name is required' })}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-400 flex items-center mt-1">
                  <AlertTriangle size={12} className="mr-1" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className={`w-full pl-10 pr-4 py-2 bg-slate-950/80 border ${
                    errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-enterprise-500'
                  } rounded-lg text-sm text-slate-250 focus:outline-none focus:ring-1 focus:ring-enterprise-500 transition-colors`}
                  placeholder="john.doe@company.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center mt-1">
                  <AlertTriangle size={12} className="mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className={`w-full pl-10 pr-4 py-2 bg-slate-950/80 border ${
                    errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-enterprise-500'
                  } rounded-lg text-sm text-slate-250 focus:outline-none focus:ring-1 focus:ring-enterprise-500 transition-colors`}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 4,
                      message: 'Password must be at least 4 characters',
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 flex items-center mt-1">
                  <AlertTriangle size={12} className="mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role Select Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Role</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Shield size={16} />
                </span>
                <select
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-350 focus:outline-none focus:border-enterprise-500 focus:ring-1 focus:ring-enterprise-500 transition-colors appearance-none cursor-pointer"
                  {...register('role', { required: 'System role is required' })}
                >
                  <option value="ENGINEER" className="bg-slate-900">ENGINEER</option>
                  <option value="ADMIN" className="bg-slate-900">ADMINISTRATOR</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-enterprise-600 hover:bg-enterprise-500 text-white font-bold rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-enterprise-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-enterprise-600/10 mt-6"
            >
              {loading ? 'Registering...' : 'Register Account'}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-400">
              Already have an operator account?{' '}
              <Link to="/login" className="text-enterprise-400 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
