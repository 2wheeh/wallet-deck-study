import { useEffect } from 'react';

import { useWalletStore } from '../store/wallet';
import { useWalletInfoStore } from '../store/walletInfo';

import { useSupportedWallets } from './useSupportedWallets';

export const useInitializeWallet = () => {
  const { walletId, clearInfo } = useWalletInfoStore();
  const { setWallet } = useWalletStore();
  const wallets = useSupportedWallets();

  useEffect(() => {
    const wallet = wallets.find(({ id }) => id === walletId);

    async function initialize() {
      if (wallet && ((await wallet.isConnected?.()) ?? true)) {
        setWallet(wallet);
      } else {
        clearInfo();
      }
    }

    initialize();
  }, [setWallet, walletId, wallets, clearInfo]);
};
