import { Link } from 'react-router-dom';

import { useWalletConnection } from '../hooks/useWalletConnection';
import { useSupportedWallets } from '../hooks/useSupportedWallets';

export const Deck = () => {
  const {
    currentWalletId,
    address,
    network,
    connect: handleConnect,
    disconnect,
  } = useWalletConnection();
  const wallets = useSupportedWallets();

  return (
    <div>
      <div>Home</div>

      {currentWalletId ? (
        <>
          <button
            className="border px-2 py-1 rounded-md bg-slate-400"
            onClick={() => disconnect().then(() => console.log('disconnected'))}
          >
            disconnect {currentWalletId}
          </button>
          <div>network: {network}</div>
          <div>address: {address}</div>
        </>
      ) : (
        <>
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className="border px-2 py-1 rounded-md bg-slate-400"
              onClick={() => handleConnect(wallet)}
            >
              connect {wallet.id}
            </button>
          ))}
        </>
      )}

      {/* this should be fetched from backend or node directly? */}
      <p>Total Balance: {2400129}</p>

      <div className="flex flex-col w-fit">
        <Link className="border px-2 py-1 rounded-md bg-slate-400" to="/receive">
          receive
        </Link>

        <Link className="border px-2 py-1 rounded-md bg-slate-400" to="/send">
          send
        </Link>
      </div>
    </div>
  );
};
