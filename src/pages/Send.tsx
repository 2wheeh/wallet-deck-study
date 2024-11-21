'use client';

import {
  WalletConnectModalSign,
  useConnect,
  useDisconnect,
  useSession,
} from '@walletconnect/modal-sign-react';
import { useEffect, useState } from 'react';
import { getAppMetadata, getSdkError } from '@walletconnect/utils';
import { Sends } from '../components/send';

export const networks = ['xrpl:0', 'xrpl:1', 'eip155:7668', 'eip155:7672'] as const;

export type NETWORK = (typeof networks)[number];

export const NETWORK_MAP: Record<NETWORK, string> = {
  'xrpl:0': 'XRPL Mainnet',
  'xrpl:1': 'XRPL Testnet',
  'eip155:7668': 'TRN Mainnet',
  'eip155:7672': 'TRN Porcini',
};

export function Send() {
  const [isConnecting, setIsConnecting] = useState(false);

  const [network, setNetwork] = useState<NETWORK>(networks[0]);
  const [account, setAccount] = useState('');
  const session = useSession();

  const { connect } = useConnect({
    requiredNamespaces: {
      xrpl: {
        chains: ['xrpl:0', 'xrpl:1'],
        methods: ['xrpl_signTransaction'],
        events: ['chainChanged', 'accountsChanged'],
      },
      eip155: {
        chains: ['eip155:7668', 'eip155:7672'],
        methods: ['eth_sendTransaction'],
        events: ['chainChanged', 'accountsChanged'],
      },
    },
  });

  async function onConnect() {
    try {
      setIsConnecting(true);
      const session = await connect();
      console.info(session);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }

  const { disconnect } = useDisconnect({
    topic: session?.topic ?? '', // this will be overwritten
    reason: getSdkError('USER_DISCONNECTED'),
  });

  const onDisconnect = async () => {
    if (!session) return;

    try {
      await disconnect({
        topic: session.topic, // overwrite the topic
        reason: getSdkError('USER_DISCONNECTED'),
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!session) return;

    const { accounts } = session.namespaces[network.split(':')[0]] ?? {
      accounts: [],
    };

    const account = accounts.find((account) => account.startsWith(network));

    if (!account) return;

    setAccount(account.split(':')[2]);
  }, [network, session]);

  return (
    <>
      {session ? (
        <>
          <button onClick={onDisconnect}>Disconnect Wallet</button>

          {account && (
            <>
              <div>account: {account}</div>
              <Sends account={account} network={network} topic={session.topic} />
            </>
          )}
        </>
      ) : (
        <button onClick={onConnect} disabled={isConnecting}>
          Connect Wallet
        </button>
      )}

      {networks.map((network) => (
        <button key={network} onClick={() => setNetwork(network)}>
          {NETWORK_MAP[network]}
        </button>
      ))}

      <WalletConnectModalSign
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID as string}
        metadata={getAppMetadata()}
        modalOptions={{
          themeMode: 'dark',
          themeVariables: {
            '--wcm-background-color': '#292A30CC',
            '--wcm-accent-color': '#34D98F',
            '--wcm-accent-fill-color': '#34D98F',
          },
          enableExplorer: false,
        }}
      />
    </>
  );
}
