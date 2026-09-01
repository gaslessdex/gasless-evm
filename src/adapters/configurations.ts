import type { ChainConfiguration, NetworkKey } from '../types/index.js';

export const chainConfigurations = {
  robinhood: { key: 'robinhood', name: 'Robinhood Chain', status: 'first-target' },
  base: { key: 'base', name: 'Base', status: 'planned' },
  bnb: { key: 'bnb', name: 'BNB Chain', status: 'planned' },
} as const satisfies Record<NetworkKey, ChainConfiguration>;
