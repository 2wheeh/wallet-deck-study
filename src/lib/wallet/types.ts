import type { Action as InfoAction } from '../../store/walletInfo';
import type { MaybePromise } from '../types';

export enum WalletId {
  GemWallet = 'gem-wallet',
  Crossmark = 'crossmark',
  Xaman = 'xaman',
}

export interface Wallet {
  readonly id: WalletId;
  connect: (onConnect: InfoAction['setInfo']) => Promise<void>;
  isConnected?: () => MaybePromise<boolean>;
  disconnect?: () => MaybePromise<void>;
  sendPayment: (payment: Payment) => Promise<string>;
}

export interface Payment {
  amount: string;
  destination: string;
}

export interface ExtensionWallet extends Wallet {
  isInstalled: () => MaybePromise<boolean>;
}
