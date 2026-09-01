import { UnimplementedChainAdapter, type ChainAdapter } from './adapter.js';
import { chainConfigurations } from './configurations.js';
import type { NetworkKey } from '../types/index.js';

const adapters = new Map<NetworkKey, ChainAdapter>(
  Object.values(chainConfigurations).map((configuration) => [
    configuration.key,
    new UnimplementedChainAdapter(configuration),
  ]),
);

export function getChainAdapter(key: string): ChainAdapter {
  const adapter = adapters.get(key as NetworkKey);
  if (!adapter) throw new Error(`Unsupported EVM network: ${key}`);
  return adapter;
}
