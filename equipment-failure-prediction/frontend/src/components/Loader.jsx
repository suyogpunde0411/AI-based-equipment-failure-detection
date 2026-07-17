import React from 'react';

export const Loader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-t-enterprise-500 border-r-transparent border-b-enterprise-300 border-l-transparent rounded-full animate-spin`}
      />
      <span className="text-sm font-medium text-slate-400 tracking-wider">
        Loading Telemetry...
      </span>
    </div>
  );
};

export default Loader;
