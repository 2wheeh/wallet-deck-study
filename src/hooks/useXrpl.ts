import { useCallback, useEffect, useMemo, useState } from 'react';
import { Client, dropsToXrp } from 'xrpl';

const WS_ENDPOINT = {
  mainnet: 'wss://s1.ripple.com',
  testnet: 'wss://s.altnet.rippletest.net:51233',
};

export function useXrpl() {
  const client = useMemo(() => new Client(WS_ENDPOINT.testnet), []);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    client.on('disconnected', () => setIsConnected(false));
    client.on('connected', () => setIsConnected(true));

    return () => {
      client.off('disconnected');
      client.off('connected');
    };
  }, [client]);

  useEffect(() => {
    const initializeClient = async () => {
      if (client.isConnected()) {
        return;
      }

      try {
        await client.connect();
      } catch (error) {
        console.error('error', error);
      }
    };

    initializeClient();
  }, [client]);

  const getXrpBalance = useCallback(
    async (account: string) => {
      if (isConnected === false) {
        throw new Error('Not connected');
      }

      const res = await client.request({
        command: 'account_info',
        account,
      });

      const balanceInDrops = res.result.account_data.Balance;
      return dropsToXrp(balanceInDrops);
    },
    [client, isConnected]
  );

  const getAccountLines = useCallback(
    async (account: string) => {
      if (isConnected === false) {
        throw new Error('Not connected');
      }

      const res = await client.request({
        command: 'account_lines',
        account,
      });

      return res.result.lines;
    },
    [client, isConnected]
  );

  const getAllBalances = useCallback(
    async (account: string) => {
      if (isConnected === false) {
        throw new Error('Not connected');
      }

      const xrpBalance = await getXrpBalance(account);
      const lines = await getAccountLines(account);

      const otherTokens = lines!.map((line) => ({
        currency: line.currency,
        balance: line.balance,
      }));

      return {
        xrp: {
          currency: 'XRP',
          balance: xrpBalance,
        },
        otherTokens,
      };
    },
    [getAccountLines, getXrpBalance, isConnected]
  );

  return { isConnected, getAllBalances };
}
