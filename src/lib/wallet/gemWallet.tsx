import {
  getAddress,
  getNetwork,
  getPublicKey,
  isInstalled as isInstalledFn,
  sendPayment as sendPaymentFn,
} from '@gemwallet/api';

import { ExtensionWallet, Payment, WalletId } from './types';
import { Action as InfoAction } from '../../store/walletInfo';

interface GemWalletInstalled {
  gemWallet?: NonNullable<unknown>;
}

export class GemWallet implements ExtensionWallet {
  id = WalletId.GemWallet;

  async isInstalled() {
    const res = await isInstalledFn();
    return res.result.isInstalled || !!(window as unknown as GemWalletInstalled).gemWallet;
  }

  async connect(onConnect: InfoAction['setInfo']) {
    if (!(await isInstalledFn())) {
      throw new Error('wallet not installed');
    }

    const res = await getPublicKey();

    if (res.result == null) {
      return;
    }

    const [addressRes, networkRes] = await Promise.all([getAddress(), getNetwork()]);

    const address = addressRes.result?.address;

    if (address == null) {
      throw new Error('address not found');
    }

    const network = networkRes.result?.network;

    if (network == null) {
      throw new Error('network not found');
    }

    onConnect({
      address,
      network,
      walletId: this.id,
    });
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
