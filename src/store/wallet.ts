import { create } from 'zustand';
import { Wallet } from '../lib/wallet/types';

interface Store {
  wallet: Wallet | null;
}

interface Action {
  setWallet: (wallet: Wallet) => void;
  clearWallet: () => void;
}

type WalletStore = Store & Action;

// not directly use this in components, use useWallet hook instead
export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,

  setWallet: (wallet) => set({ wallet }),
  clearWallet: () => {
    return set({ wallet: null });
  },
}));
