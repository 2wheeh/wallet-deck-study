import { useCallback } from 'react';

import { Payment, Wallet } from '../lib/wallet/types';

import { useWalletStore } from '../store/wallet';
import { useWalletInfoStore } from '../store/walletInfo';

export const useWalletConnection = () => {
  const { address, clearInfo, network, setInfo, walletId } = useWalletInfoStore();
  const { wallet: currentWallet, clearWallet } = useWalletStore();

  const connect = useCallback(
    async (wallet: Wallet) => {
      await wallet.connect(setInfo);
    },
    [setInfo]
  );

  const disconnect = useCallback(async () => {
    await currentWallet?.disconnect?.();

    clearInfo();
    clearWallet();
  }, [currentWallet, clearInfo, clearWallet]);

  const send = useCallback(
    async (payment: Payment) => {
      if (!currentWallet) {
        throw new Error('wallet not set');
      }

      const hash = await currentWallet.sendPayment(payment);

      return hash;
    },
    [currentWallet]
  );

  return {
    address,
    network,
    connect,
    send,
    disconnect,
    currentWalletId: walletId,
    isConnected: !!walletId,
  };
};
