export type EvmAction = 'bridge' | 'swap' | 'send';
export type NetworkKey = 'robinhood' | 'base' | 'bnb';
export type HexAddress = `0x${string}`;

export interface ChainConfiguration {
  readonly key: NetworkKey;
  readonly name: string;
  readonly status: 'first-target' | 'planned';
  readonly chainId?: bigint;
  readonly rpcUrl?: URL;
}

export interface AuthorizationRequest {
  readonly requestId: string;
  readonly action: EvmAction;
  readonly chainId: bigint;
  readonly wallet: HexAddress;
  readonly target: HexAddress;
  readonly valueWei: bigint;
  readonly sponsorCostWei: bigint;
  readonly nonce: bigint;
  readonly expiresAt: number;
}

export interface ExecutionResult {
  readonly transactionHash: `0x${string}`;
}
