'use client';

import { useRequest } from '@walletconnect/modal-sign-react';
import { useEffect, useState } from 'react';

interface Props {
  topic: string;
  account: string;
  network: string;
}

export function Sends({ topic, network, account }: Props) {
  const [destination, setDestination] = useState('rGA3kwmB5hBnvs6VW1fnGKysJfBCUazDrD');
  const [amount, setAmount] = useState('100000');

  const { request: sendTransaction, data } = useRequest({
    chainId: network,
    topic,
    request: network.startsWith('xrpl')
      ? {
          method: 'xrpl_signTransaction',
          params: {
            tx_json: {
              TransactionType: 'Payment',
              Account: account,
              Destination: destination,
              Amount: amount,
            },
          },
        }
      : {
          method: 'eth_sendTransaction',
          params: [
            {
              from: account,
              to: '0xBDE1EAE59cE082505bB73fedBa56252b1b9C60Ce',
              value: '0x' + BigInt(amount).toString(16),
              data: '0x',
            },
          ],
        },
  });

  useEffect(() => {
    if (!data) return;

    console.log('send result', data);
  }, [data]);

  return (
    <div>
      <input
        type="text"
        value={destination}
        placeholder="Enter destination"
        onChange={(e) => setDestination(e.target.value)}
      />

      <input
        type="text"
        value={amount}
        placeholder="Enter amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={() => sendTransaction()}>{network} Send</button>
    </div>
  );
}
