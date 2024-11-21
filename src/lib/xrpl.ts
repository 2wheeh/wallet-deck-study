// xrpl-types.ts

export interface XrplTransactionResponse {
  tx_json: {
    Account: string;
    TransactionType: string;
    Destination?: string;
    Amount:
      | string
      | {
          currency: string;
          issuer: string;
          value: string;
        };
    Sequence?: number;
    Fee?: string;
    SigningPubKey?: string;
    TxnSignature?: string;
    Hash?: string;
    LastLedgerSequence?: number;
    Flags?: number;
    SourceTag?: number;
    DestinationTag?: number;
    Memos?: Array<{
      Memo: {
        MemoData?: string;
        MemoType?: string;
        MemoFormat?: string;
      };
    }>;
    [key: string]: unknown; // For other transaction-specific fields
  };
  hash?: string; // tx_hash may be included in response
}

export interface XrplSignTransactionParams {
  tx_json: {
    TransactionType: string;
    Destination?: string;
    Amount:
      | string
      | {
          currency: string;
          issuer: string;
          value: string;
        };
    SourceTag?: number;
    DestinationTag?: number;
    Memos?: Array<{
      Memo: {
        MemoData?: string;
        MemoType?: string;
        MemoFormat?: string;
      };
    }>;
    [key: string]: unknown; // For other transaction-specific fields
  };
  autofill?: boolean;
  submit?: boolean;
}

export interface XrplSignTransactionForParams extends XrplSignTransactionParams {
  tx_signer: string;
}

// Namespace definitions for XRPL
export interface XrplNamespace {
  chains: string[];
  methods: XrplMethods[];
  events: XrplEvents[];
  accounts: string[];
}

export type XrplMethods =
  | 'xrpl_signTransaction'
  | 'xrpl_signTransactionFor'
  | 'xrpl_signMessage'
  | 'xrpl_getAddress';

export type XrplEvents = 'chainChanged' | 'accountsChanged' | 'disconnect';

// Custom error types
export class XrplTransactionError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'XrplTransactionError';
  }
}
