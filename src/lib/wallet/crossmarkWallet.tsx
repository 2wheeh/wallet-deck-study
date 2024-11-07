import { ExtensionWallet, Payment } from './types';
import sdk from '@crossmarkio/sdk';

export class CrossmarkWallet implements ExtensionWallet {
  address: string | null = null;
  network: string | null = null;

  isInstalled() {
    return !!sdk.sync.isInstalled();
  }

  isConnected() {
    return sdk.sync.isConnected();
  }

  async connect() {
    if (!this.isInstalled()) {
      throw new Error('wallet not installed');
    }

    const { response } = await sdk.methods.signInAndWait();

    this.address = response.data.address;
    this.network = response.data.network.type;
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
    if (!this.isConnected()) {
      throw new Error('wallet not connected');
    }

    const { response } = await sdk.methods.signAndSubmitAndWait({
      TransactionType: 'Payment',
      Account: this.getAddresses(),
      Destination: payment.destination,
      Amount: payment.amount,
    });

    return response.data.resp.result.hash;
  }
}
