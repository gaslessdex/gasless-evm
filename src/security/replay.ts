import { createHash } from 'node:crypto';
import type { AuthorizationRequest } from '../types/index.js';

export function createReplayKey(request: AuthorizationRequest): string {
  const material = [
    'gasless-evm-v1',
    request.chainId.toString(),
    request.wallet.toLowerCase(),
    request.nonce.toString(),
    request.requestId,
  ].join(':');
  return createHash('sha256').update(material).digest('hex');
}
