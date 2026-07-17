import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Equipment from '../pages/Equipment';
import Prediction from '../pages/Prediction';
import CsvUpload from '../pages/CsvUpload';
import Analytics from '../pages/Analytics';
import MaintenanceHistory from '../pages/MaintenanceHistory';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Telemetry Dashboard Panel */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="equipment" element={<Equipment />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="csv-upload" element={<CsvUpload />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="maintenance-history" element={<MaintenanceHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
