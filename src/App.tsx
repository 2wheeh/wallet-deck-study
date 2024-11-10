import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useInitializeWallet } from './hooks/useInitializeWallet';

function App() {
  useInitializeWallet();

  return <RouterProvider router={router} />;
}

export default App;
