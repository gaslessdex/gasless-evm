import type { AuthorizationRequest, HexAddress } from '../types/index.js';

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export interface RequestPolicy {
  readonly expectedChainId: bigint;
  readonly approvedTargets: ReadonlySet<string>;
  readonly maxSponsorCostWei: bigint;
  readonly now: number;
}

export function normalizeAddress(value: string): HexAddress {
  if (!ADDRESS_PATTERN.test(value)) throw new Error('Invalid EVM address');
  return value.toLowerCase() as HexAddress;
}

export function validateAuthorizationRequest(
  request: AuthorizationRequest,
  policy: RequestPolicy,
): void {
  if (request.chainId !== policy.expectedChainId) throw new Error('Chain ID mismatch');
  if (request.expiresAt <= policy.now) throw new Error('Authorization expired');
  if (request.sponsorCostWei < 0n || request.sponsorCostWei > policy.maxSponsorCostWei) {
    throw new Error('Sponsorship cap exceeded');
  }
  if (request.valueWei < 0n) throw new Error('Negative transaction value');
  if (normalizeAddress(request.wallet) === normalizeAddress(request.target)) {
    throw new Error('Wallet cannot be the execution target');
  }
  if (!policy.approvedTargets.has(normalizeAddress(request.target))) {
    throw new Error('Target contract is not approved');
  }
}
