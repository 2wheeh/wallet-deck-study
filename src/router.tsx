import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Deck } from './pages/Deck';
import { Send } from './pages/Send';

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
        element: <div>Receive</div>,
      },
      {
        path: 'send',
        element: <Send />,
      },
    ],
  },
]);
