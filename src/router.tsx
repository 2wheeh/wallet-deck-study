import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Deck } from './pages/Deck';
import { Send } from './pages/Send';
import { Receive } from './pages/Receive';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        element: <Deck />,
      },
      {
        path: 'receive',
        element: (
          <ProtectedRoute>
            <Receive />
          </ProtectedRoute>
        ),
      },
      {
        path: 'send',
        element: <Send />,
      },
    ],
  },
]);
