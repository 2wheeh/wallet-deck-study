import { create } from 'zustand';
import { Wallet } from '../lib/wallet/types';

interface WalletStore {
  address: string | null;
  network: string | null;
  wallet: Wallet | null;

  setWallet: (wallet: Wallet) => void;
  setAddress: (address: string) => void;
  setNetwork: (network: string) => void;
}

export const walletStore = create<WalletStore>((set) => ({
  address: null,
  network: null,
  wallet: null,

  setWallet: (wallet) => set({ wallet }),
  setAddress: (address) => set({ address }),
  setNetwork: (network) => set({ network }),
}));
