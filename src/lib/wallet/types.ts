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
