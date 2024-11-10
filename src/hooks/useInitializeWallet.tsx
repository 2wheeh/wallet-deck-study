import { useEffect } from 'react';

import { useWalletStore } from '../store/wallet';
import { useWalletInfoStore } from '../store/walletInfo';

import { useSupportedWallets } from './useSupportedWallets';

export const useInitializeWallet = () => {
  const { walletId } = useWalletInfoStore();
  const { setWallet, clearWallet } = useWalletStore();
  const wallets = useSupportedWallets();

  useEffect(() => {
    let mounted = true;
    const wallet = wallets.find(({ id }) => id === walletId);

    async function initialize() {
      if (wallet && ((await wallet.isConnected?.()) ?? true) && mounted) {
        setWallet(wallet);
      }
    }

    initialize();

    return () => {
      mounted = false;
      clearWallet();
    };
  }, [setWallet, walletId, clearWallet, wallets]);
};
