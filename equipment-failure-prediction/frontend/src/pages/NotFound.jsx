import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-enterprise-400 shadow-xl animate-pulse">
        <HelpCircle size={44} />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">404 - Grid Node Offline</h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          The requested system node or telemetry page does not exist in our telemetry grid.
        </p>
      </div>

      <Link to="/dashboard">
        <Button variant="primary" className="flex items-center space-x-1.5">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
