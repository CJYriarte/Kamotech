import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {

  const { user, profile } = useAuth();

  // If Not logged in at all -> bounce to login

  if (!user) {

    return <Navigate to="/login" replace />;

  }

  // If Logged in, but their role isn't allowed here -> this will bounce to home

  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {

    return <Navigate to="/" replace />;

  }

  // Passed both checks -> render whatever route this wraps

  return <Outlet />;
  
}