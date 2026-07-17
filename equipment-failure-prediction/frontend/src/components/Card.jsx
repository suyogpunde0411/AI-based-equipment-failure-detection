import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', title, subtitle, icon: Icon, onClick }) => {
  const CardContent = (
    <div
      className={`p-6 rounded-xl border border-slate-800/80 bg-slate-900/60 shadow-lg hover:shadow-enterprise-500/5 hover:border-slate-700/60 transition-all duration-300 ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-enterprise-400 shadow-inner">
              <Icon size={18} />
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {CardContent}
      </motion.div>
    );
  }

  return CardContent;
};

export default Card;
