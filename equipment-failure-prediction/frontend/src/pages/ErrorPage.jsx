import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import Button from '../components/Button';

export const ErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-400 shadow-xl animate-bounce">
        <AlertOctagon size={44} />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Telemetry Processing Fault</h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          An unexpected runtime error occurred while processing system parameters.
        </p>
        {error && (
          <pre className="mt-4 p-3 bg-slate-900 border border-slate-850 rounded-lg text-[10px] text-red-400 font-mono text-left max-w-lg overflow-x-auto whitespace-pre-wrap">
            {error.message || String(error)}
          </pre>
        )}
      </div>

      <Button
        onClick={() => resetErrorBoundary ? resetErrorBoundary() : window.location.reload()}
        variant="outline"
        className="flex items-center space-x-1.5"
      >
        <RefreshCw size={14} />
        <span>Reload Interface</span>
      </Button>
    </div>
  );
};

export default ErrorPage;
