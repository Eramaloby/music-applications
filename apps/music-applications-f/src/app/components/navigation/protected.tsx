import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({
  isAccessible,
  children,
}: {
  isAccessible: boolean;
  children: ReactNode;
}) => {
  if (!isAccessible) {
    return <Navigate to="/"></Navigate>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
