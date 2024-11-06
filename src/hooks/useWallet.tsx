import { Payment, Wallet } from '../lib/wallet/types';
import { walletStore } from '../store/wallet';

export const useWallet = () => {
  const { address, network, wallet, setAddress, setNetwork, setWallet } = walletStore();

  const connect = async (wallet: Wallet) => {
    setWallet(wallet);

    await wallet.connect();

    setAddress(wallet.getAddresses());
    setNetwork(wallet.getNetwork());
  };

  const send = async (payment: Payment) => {
    if (!wallet) {
      throw new Error('wallet not set');
    }

    const hash = await wallet.sendPayment(payment);

    return hash;
  };

  return {
    address,
    network,
    connect,
    send,
  };
};
