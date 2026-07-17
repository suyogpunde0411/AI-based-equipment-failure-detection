import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow min-w-0 h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Route Screen wrapper */}
        <main className="flex-grow overflow-y-auto bg-slate-950 p-6 md:p-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full max-w-[1600px] mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
