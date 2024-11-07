import { MaybePromise } from '../types';

export interface Wallet {
  address: string | null;
  network: string | null;
  connect: () => Promise<void>;
  getAddresses: () => string;
  getNetwork: () => string;
  sendPayment: (payment: Payment) => Promise<string>;
}

export interface Payment {
  amount: string;
  destination: string;
}

export interface ExtensionWallet extends Wallet {
  isInstalled: () => MaybePromise<boolean>;
}
