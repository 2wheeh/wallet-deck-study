import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { GemWallet } from '../lib/wallet/gemWallet';
import { useWallet } from '../hooks/useWallet';
import { CrossmarkWallet } from '../lib/wallet/crossmarkWallet';

export const Deck = () => {
  const { address, network, connect: handleConnect } = useWallet();

  const gemWallet = useMemo(() => new GemWallet(), []);
  const crossmarkWallet = useMemo(() => new CrossmarkWallet(), []);

  return (
    <div>
      <div>Home</div>

      <button
        className="border px-2 py-1 rounded-md bg-slate-400"
        onClick={() => handleConnect(gemWallet)}
      >
        Connect GemWallet
      </button>
      <button
        className="border px-2 py-1 rounded-md bg-slate-400"
        onClick={() => handleConnect(crossmarkWallet)}
      >
        Connect CrossmarkWallet
      </button>

      <div>network: {network}</div>
      <div>address: {address}</div>

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
