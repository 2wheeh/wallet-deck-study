import { Web3Modal } from '@web3modal/standalone';

import Client from '@walletconnect/sign-client';
import { ProposalTypes, SessionTypes, SignClientTypes } from '@walletconnect/types';
import { getSdkError, getAppMetadata } from '@walletconnect/utils';

import { Payment, Wallet, WalletId } from './types';
import type { Action } from '../../store/walletInfo';

interface WalletConnectAdapterConfig {
  projectId: string;
  metadata?: SignClientTypes.Metadata;
  logger?: string;
}

interface WalletConnectSession {
  topic: string;
  acknowledged: boolean;
  namespaces: SessionTypes.Namespaces;
  pairingTopic: string;
}

export class WalletConnectAdapter implements Wallet {
  readonly id = WalletId.WalletConnect;

  #client: Client | null = null;
  #session: WalletConnectSession | null = null;
  #web3Modal: Web3Modal | null = null;
  #initializing: boolean = false;
  readonly #config: WalletConnectAdapterConfig;

  constructor(config: WalletConnectAdapterConfig) {
    this.#config = config;
    this.initializeClient();
    this.initializeWeb3Modal();
  }

  private initializeWeb3Modal() {
    if (this.#web3Modal) {
      return;
    }

    this.#web3Modal = new Web3Modal({
      projectId: this.#config.projectId,
      themeMode: 'light',
      walletConnectVersion: 2,
      explorerRecommendedWalletIds: [
        // Add any recommended wallet IDs here
      ],
    });
  }

  private async initializeClient() {
    if (this.#initializing || this.#client) {
      return;
    }

    try {
      this.#initializing = true;

      this.#client = await Client.init({
        logger: this.#config.logger || 'error',
        projectId: this.#config.projectId,
        metadata: this.#config.metadata || getAppMetadata(),
      });

      await this.subscribeToEvents();
      await this.checkPersistedState();
    } catch (error) {
      console.error('Failed to initialize WalletConnect client:', error);
      throw error;
    } finally {
      this.#initializing = false;
    }
  }

  private async subscribeToEvents() {
    if (!this.#client) return;

    this.#client.on('session_ping', ({ topic }) => {
      console.log('Received ping for topic:', topic);
    });

    this.#client.on('session_event', ({ params }) => {
      console.log('Received chain event:', params.event);
    });

    this.#client.on('session_update', ({ topic, params }) => {
      const { namespaces } = params;
      if (!this.#client) return;

      const session = this.#client.session.get(topic);
      this.#session = { ...session, namespaces };
    });

    this.#client.on('session_delete', () => {
      this.#session = null;
    });
  }

  private async checkPersistedState() {
    if (!this.#client) return;

    // Check for existing sessions
    if (this.#client.session.length) {
      const lastKeyIndex = this.#client.session.keys.length - 1;
      this.#session = this.#client.session.get(this.#client.session.keys[lastKeyIndex]);
    }
  }

  async connect(onConnect: Action['setInfo']): Promise<void> {
    if (!this.#client) {
      throw new Error('WalletConnect client not initialized');
    }

    try {
      const requiredNamespaces: ProposalTypes.RequiredNamespaces = {
        xrpl: {
          chains: ['xrpl:0'],
          methods: ['xrpl_signTransaction', 'xrpl_signTransactionFor'],
          events: ['chainChanged', 'accountsChanged'],
        },
      };

      const { uri, approval } = await this.#client.connect({
        requiredNamespaces,
      });

      if (uri) {
        const standaloneChains = Object.values(requiredNamespaces)
          .map((namespace) => namespace.chains)
          .flat();

        this.#web3Modal?.openModal({ uri, standaloneChains });
      }

      const session = await approval();
      this.#session = session;

      // Extract account and network information
      const accounts = Object.values(session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat();

      if (accounts.length === 0) {
        throw new Error('No accounts found in session');
      }

      // Format: "xrpl:0:rAddress"
      const [network, , address] = accounts[0].split(':');

      onConnect({
        address,
        network,
        walletId: this.id,
      });
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    } finally {
      this.#web3Modal?.closeModal();
    }
  }

  async disconnect(): Promise<void> {
    if (!this.#client || !this.#session) {
      throw new Error('No active session');
    }

    try {
      await this.#client.disconnect({
        topic: this.#session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
      this.#session = null;
    } catch (error) {
      console.error('Failed to disconnect:', error);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    await this.initializeClient();
    return !!this.#session;
  }

  async sendPayment(payment: Payment): Promise<string> {
    if (!this.#client || !this.#session) {
      throw new Error('No active session');
    }

    try {
      const response = await this.#client.request<{ tx_hash: string }>({
        topic: this.#session.topic,
        chainId: 'xrpl:0',
        request: {
          method: 'xrpl_signTransaction',
          params: {
            tx_json: {
              TransactionType: 'Payment',
              Destination: payment.destination,
              Amount: payment.amount,
            },
            autofill: true,
            submit: true,
          },
        },
      });

      if (!response.tx_hash) {
        throw new Error('No transaction hash returned');
      }

      return response.tx_hash;
    } catch (error) {
      console.error('Failed to send payment:', error);
      throw error;
    }
  }
}
