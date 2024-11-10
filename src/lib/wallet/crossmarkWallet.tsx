import { Action } from '../../store/walletInfo';
import { ExtensionWallet, Payment, WalletId } from './types';
import sdk from '@crossmarkio/sdk';

export class CrossmarkWallet implements ExtensionWallet {
  id = WalletId.Crossmark;

  isInstalled() {
    return !!sdk.sync.isInstalled();
  }

  isConnected() {
    return !!sdk.methods.isConnected();
  }

  async connect(onConnect: Action['setInfo']) {
    if (!this.isInstalled()) {
      throw new Error('wallet not installed');
    }

    const { response } = await sdk.methods.signInAndWait();

    onConnect({
      address: response.data.address,
      network: response.data.network.type,
      walletId: this.id,
    });
  }

  async sendPayment(payment: Payment) {
    if (!this.isConnected()) {
      throw new Error('wallet not connected');
    }

    const address = sdk.methods.getAddress();

    if (!address) {
      throw new Error('wallet address not found');
    }

    const { response } = await sdk.methods.signAndSubmitAndWait({
      TransactionType: 'Payment',
      Account: address,
      Destination: payment.destination,
      Amount: payment.amount,
    });

    return response.data.resp.result.hash;
  }
}
