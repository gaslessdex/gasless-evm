import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  chainConfigurations,
  createReplayKey,
  getChainAdapter,
  loadRuntimeConfiguration,
  normalizeAddress,
  redact,
  validateAuthorizationRequest,
  type AuthorizationRequest,
} from '../src/index.js';

const wallet = '0x1111111111111111111111111111111111111111' as const;
const target = '0x2222222222222222222222222222222222222222' as const;

function request(overrides: Partial<AuthorizationRequest> = {}): AuthorizationRequest {
  return {
    requestId: 'request-1',
    action: 'send',
    chainId: 123n,
    wallet,
    target,
    valueWei: 0n,
    sponsorCostWei: 10n,
    nonce: 7n,
    expiresAt: 2_000,
    ...overrides,
  };
}

const policy = {
  expectedChainId: 123n,
  approvedTargets: new Set([target]),
  maxSponsorCostWei: 100n,
  now: 1_000,
};

test('registry exposes one shared adapter surface with Robinhood first', () => {
  assert.equal(getChainAdapter('robinhood').configuration.status, 'first-target');
  assert.equal(getChainAdapter('base').configuration.status, 'planned');
  assert.equal(getChainAdapter('bnb').configuration.status, 'planned');
  assert.equal(Object.keys(chainConfigurations).length, 3);
});

test('unsupported networks fail closed', () => {
  assert.throws(() => getChainAdapter('unknown'), /Unsupported EVM network/);
});

test('placeholder execution fails explicitly and safely', async () => {
  await assert.rejects(getChainAdapter('robinhood').execute(request()), /not implemented/);
});

test('authorization accepts a bounded request for an exact approved target', () => {
  assert.doesNotThrow(() => validateAuthorizationRequest(request(), policy));
});

test('chain ID mismatch and expired authorization are rejected', () => {
  assert.throws(() => validateAuthorizationRequest(request({ chainId: 124n }), policy), /Chain ID mismatch/);
  assert.throws(() => validateAuthorizationRequest(request({ expiresAt: 1_000 }), policy), /expired/);
});

test('unsafe arbitrary targets and self-targeting are rejected', () => {
  assert.throws(
    () => validateAuthorizationRequest(request({ target: '0x3333333333333333333333333333333333333333' }), policy),
    /not approved/,
  );
  assert.throws(() => validateAuthorizationRequest(request({ target: wallet }), policy), /cannot be/);
});

test('sponsorship policy enforces non-negative bounded exposure', () => {
  assert.throws(() => validateAuthorizationRequest(request({ sponsorCostWei: 101n }), policy), /cap/);
  assert.throws(() => validateAuthorizationRequest(request({ sponsorCostWei: -1n }), policy), /cap/);
  assert.throws(() => validateAuthorizationRequest(request({ valueWei: -1n }), policy), /Negative/);
});

test('address validation is exact and normalizes case', () => {
  assert.equal(normalizeAddress('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  assert.throws(() => normalizeAddress('0x1234'), /Invalid/);
});

test('replay keys are deterministic and domain-separated by chain, wallet, nonce, and request', () => {
  const first = createReplayKey(request());
  assert.equal(first, createReplayKey(request()));
  assert.notEqual(first, createReplayKey(request({ chainId: 124n })));
  assert.notEqual(first, createReplayKey(request({ nonce: 8n })));
  assert.notEqual(first, createReplayKey(request({ requestId: 'request-2' })));
});

test('redaction removes nested sensitive values without mutating safe data', () => {
  assert.deepEqual(redact({ wallet, authorization: 'bearer', nested: { apiToken: 'value', chainId: 123 } }), {
    wallet,
    authorization: '[REDACTED]',
    nested: { apiToken: '[REDACTED]', chainId: 123 },
  });
});

test('runtime configuration requires explicit supported HTTPS values', () => {
  assert.deepEqual(
    loadRuntimeConfiguration({
      GASLESS_EVM_NETWORK: 'robinhood',
      GASLESS_EVM_CHAIN_ID: '123',
      GASLESS_EVM_RPC_URL: 'https://rpc.invalid',
      GASLESS_EVM_MAX_SPONSOR_WEI: '100',
    }),
    { network: 'robinhood', chainId: 123n, rpcUrl: new URL('https://rpc.invalid'), maxSponsorWei: 100n },
  );
  assert.throws(() => loadRuntimeConfiguration({}), /NETWORK/);
  assert.throws(
    () => loadRuntimeConfiguration({
      GASLESS_EVM_NETWORK: 'robinhood',
      GASLESS_EVM_CHAIN_ID: '123',
      GASLESS_EVM_RPC_URL: 'http://rpc.invalid',
      GASLESS_EVM_MAX_SPONSOR_WEI: '100',
    }),
    /HTTPS/,
  );
});
