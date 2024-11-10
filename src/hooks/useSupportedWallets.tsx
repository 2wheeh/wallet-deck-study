import { useMemo } from 'react';

import { CrossmarkWallet } from '../lib/wallet/crossmarkWallet';
import { GemWallet } from '../lib/wallet/gemWallet';
import { XamanWallet } from '../lib/wallet/xamanWallet';
import { Wallet } from '../lib/wallet/types';

const gemWallet = new GemWallet();
const crossmarkWallet = new CrossmarkWallet();
const xamanWallet = new XamanWallet();

export const useSupportedWallets = (): Wallet[] => {
  // TODO: check if wallet is installed here?
  return useMemo(() => [gemWallet, crossmarkWallet, xamanWallet], []);
};
