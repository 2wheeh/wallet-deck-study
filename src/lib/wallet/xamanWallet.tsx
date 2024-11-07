import { XummPkce } from 'xumm-oauth2-pkce';
import { Payment, Wallet } from './types';
import { Xumm } from 'xumm';

const API_KEY = '0f3b28ed-2ccc-4a8d-bf00-dfddce93ca7b';

export class XamanWallet implements Wallet {
  address: string | null = null;
  network: string | null = null;
  #apiKey: string | null = null;
  #sdk: Xumm | null = null;

  async connect() {
    const pkce = new XummPkce(API_KEY);

    try {
      const res = await pkce.authorize();

      if (res) {
        this.#apiKey = res.jwt;
        // this.address = res.me.account;
        // this.network = res.me.networkType;
      }
    } catch (error) {
      console.error('Error pinging Xaman:', error);
    }

    if (!this.#apiKey) {
      return;
    }

    this.#sdk = new Xumm(this.#apiKey);

    const network = await this.#sdk.user.networkType;
    const address = await this.#sdk.user.account;

    if (network == null) {
      throw new Error('network not found');
    }

    if (address == null) {
      throw new Error('address not found');
    }

    this.address = address;
    this.network = network;
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
        if (Object.keys(eventMessage.data).indexOf('opened') > -1) {
          // Update the UI? The payload was opened on the Xaman app
        }
        if (Object.keys(eventMessage.data).indexOf('signed') > -1) {
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
