import {
  getAddress,
  getNetwork,
  isInstalled as isInstalledFn,
  sendPayment as sendPaymentFn,
} from '@gemwallet/api';
import { Payment, Wallet } from './types';

export class GemWallet implements Wallet {
  address: string | null = null;
  network: string | null = null;

  async isInstalled() {
    const res = await isInstalledFn();
    return res.result.isInstalled;
  }

  async connect() {
    if (!(await isInstalledFn())) {
      return;
    }

    const [addressRes, networkRes] = await Promise.all([getAddress(), getNetwork()]);

    if (addressRes.result?.address) {
      this.address = addressRes.result.address;
    }

    if (networkRes.result?.network) {
      this.network = networkRes.result.network;
    }
  }

  getAddresses() {
    if (!this.address) {
      throw new Error('connect wallet first');
    }

    return this.address;
  }

  getNetwork() {
    if (!this.network) {
      throw new Error('connect wallet first');
    }

    return this.network;
  }

  async sendPayment(payment: Payment) {
    if (!(await isInstalledFn())) {
      throw new Error('wallet not installed');
    }

    const res = await sendPaymentFn(payment);

    if (!res.result) {
      throw new Error('sendPayment failed');
    }

    return res.result.hash;
  }
}
