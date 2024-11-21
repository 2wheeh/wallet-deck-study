import { PropsWithChildren } from 'react';

import { useWalletConnection } from '../hooks/useWalletConnection';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isConnected } = useWalletConnection();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
