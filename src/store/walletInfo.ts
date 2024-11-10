import { create } from 'zustand';
import { WalletId } from '../lib/wallet/types';
import { persist } from 'zustand/middleware';

interface State {
  walletId: WalletId | null;
  address: string | null;
  network: string | null;
}

export interface Action {
  setInfo: ({ walletId, address, network }: Partial<State>) => void;
  clearInfo: () => void;
}

type WalletInfoStore = State & Action;

// not directly use this in components, use useWallet hook instead
export const useWalletInfoStore = create<WalletInfoStore>()(
  persist(
    (set) => ({
      walletId: null,
      address: null,
      network: null,

      setInfo: ({ walletId, address, network }) => set({ walletId, address, network }),
      clearInfo: () => set({ walletId: null, address: null, network: null }),
    }),
    { name: 'local:WALLET-DECK' }
  )
);
