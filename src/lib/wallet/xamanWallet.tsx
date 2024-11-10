import { XummPkce } from 'xumm-oauth2-pkce';
import { Payment, Wallet, WalletId } from './types';
import { Xumm } from 'xumm';
import { Action } from '../../store/walletInfo';

const API_KEY = import.meta.env.VITE_XAMAN_API_KEY as string;
const pkce = new XummPkce(API_KEY);

export class XamanWallet implements Wallet {
  id = WalletId.Xaman;
  #jwt: string | null = null;
  #sdk: Xumm | null = null;

  async isConnected() {
    try {
      const res = await pkce.state();

      if (res?.jwt) {
        this.#jwt = res.jwt;
        this.#sdk = new Xumm(this.#jwt);

        return true;
      }
    } catch {
      // fail silently - error from the last attempt to pkce.authorize()
    }

    return false;
  }

  async connect(onConnect: Action['setInfo']) {
    if (!(await this.isConnected())) {
      try {
        const res = await pkce.authorize();
        this.#jwt = res?.jwt ?? null;
      } catch (error) {
        console.error('Error pinging Xaman:', error);
      }

      // when user cancels the login
      if (this.#jwt == null) {
        return;
      }

      this.#sdk = new Xumm(this.#jwt);
    }

    if (!this.#sdk) {
      throw new Error('sdk not found');
    }

    const network = await this.#sdk.user.networkType;
    const address = await this.#sdk.user.account;

    if (network == null) {
      throw new Error('network not found');
    }

    if (address == null) {
      throw new Error('address not found');
    }

    onConnect({
      address,
      network,
      walletId: this.id,
    });
  }

  async disconnect() {
    pkce.logout();
    await this.#sdk?.logout();

    this.#jwt = null;
    this.#sdk = null;
  }

  async sendPayment(payment: Payment) {
    if (!this.#sdk) {
      throw new Error('connect wallet first');
    }

    if (!this.#sdk.payload) {
      throw new Error('payload not available');
    }

    // https://docs.xaman.dev/js-ts-sdk/examples-user-stories/sign-requests-payloads/browser#desktop
    const { created, resolved } = await this.#sdk.payload.createAndSubscribe(
      {
        TransactionType: 'Payment',
        Destination: payment.destination,
        Amount: payment.amount,
      },
      (eventMessage) => {
        if ('opened' in eventMessage.data) {
          // Update the UI? The payload was opened on the Xaman app
        }
        if ('signed' in eventMessage.data) {
          // The `signed` property is present, true (signed) / false (rejected)
          // User signed the payload on the Xaman app
          return eventMessage;
        }
      }
    );

    // console.log('payload url:', created.next.always);
    // console.log('payload qr:', created.refs.qr_png);

    // need void to wait for the resolved promise to resolve
    void (await resolved);

    const res = await this.#sdk.payload.resolvePayload(created);

    if (!res?.response.txid) {
      throw new Error('sendPayment failed');
    }

    return res.response.txid;
  }
}
