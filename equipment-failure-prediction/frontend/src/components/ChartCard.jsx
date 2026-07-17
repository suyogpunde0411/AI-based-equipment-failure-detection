import React from 'react';
import Card from './Card';
import Loader from './Loader';

export const ChartCard = ({
  children,
  title,
  subtitle,
  icon,
  loading = false,
  empty = false,
  emptyMessage = 'No telemetry data available for this chart',
  className = '',
}) => {
  return (
    <Card title={title} subtitle={subtitle} icon={icon} className={`flex flex-col h-full ${className}`}>
      <div className="relative flex-grow flex items-center justify-center min-h-[280px]">
        {loading ? (
          <Loader size="md" />
        ) : empty ? (
          <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center">
            <svg
              className="w-12 h-12 mb-3 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-sm font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <div className="w-full h-full min-h-[280px] text-slate-300">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChartCard;
