import { FormEvent, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export const Send = () => {
  const { send } = useWallet();

  const [resultHash, setResultHash] = useState<string | null>(null);

  const handleSendPayment = async (e: FormEvent) => {
    e.preventDefault();

    const hash = await send({ destination: 'rDs7YdriFqTvJMY8uzjtQhpbjY5jCfSQkv', amount: '10' });
    setResultHash(hash);
  };

  return (
    <form onSubmit={handleSendPayment}>
      <button className="border px-2 py-1 rounded-md bg-slate-400" type="submit">
        send 10
      </button>

      <p>result: {resultHash}</p>
    </form>
  );
};
