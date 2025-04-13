import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const adminToken = localStorage.getItem('adminToken');

  if (adminOnly) {
    if (!adminToken) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
