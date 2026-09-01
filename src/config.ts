import type { NetworkKey } from './types/index.js';

export interface RuntimeConfiguration {
  readonly network: NetworkKey;
  readonly chainId: bigint;
  readonly rpcUrl: URL;
  readonly maxSponsorWei: bigint;
}

export function loadRuntimeConfiguration(env: NodeJS.ProcessEnv): RuntimeConfiguration {
  const network = env.GASLESS_EVM_NETWORK;
  if (network !== 'robinhood' && network !== 'base' && network !== 'bnb') {
    throw new Error('GASLESS_EVM_NETWORK is unsupported or missing');
  }
  if (!env.GASLESS_EVM_CHAIN_ID || !/^\d+$/.test(env.GASLESS_EVM_CHAIN_ID)) {
    throw new Error('GASLESS_EVM_CHAIN_ID must be a positive integer');
  }
  const chainId = BigInt(env.GASLESS_EVM_CHAIN_ID);
  if (chainId <= 0n) throw new Error('GASLESS_EVM_CHAIN_ID must be a positive integer');
  if (!env.GASLESS_EVM_RPC_URL) throw new Error('GASLESS_EVM_RPC_URL is required');
  const rpcUrl = new URL(env.GASLESS_EVM_RPC_URL);
  if (rpcUrl.protocol !== 'https:') throw new Error('GASLESS_EVM_RPC_URL must use HTTPS');
  if (!env.GASLESS_EVM_MAX_SPONSOR_WEI || !/^\d+$/.test(env.GASLESS_EVM_MAX_SPONSOR_WEI)) {
    throw new Error('GASLESS_EVM_MAX_SPONSOR_WEI must be a non-negative integer');
  }
  return { network, chainId, rpcUrl, maxSponsorWei: BigInt(env.GASLESS_EVM_MAX_SPONSOR_WEI) };
}
