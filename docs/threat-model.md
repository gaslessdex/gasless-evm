# Threat model

This document separates requirements for future execution from mitigations present in the current scaffold. Today, all adapters reject execution. The foundational code additionally validates configured networks, chain IDs, expiry, target allowlists, sponsorship caps, replay-key inputs, and log redaction.

| Threat | Required mitigation before execution |
| --- | --- |
| Chain-ID confusion and cross-chain replay | Bind chain ID into every request, signature domain, replay key, simulation, and submission; reject wallet-network mismatch. |
| Nonce or signature replay | Durable one-use nonce locks, short expiry, EIP-712 domain separation, idempotent state transitions, and no blind resubmission. |
| Arbitrary-call injection | Server construction plus independent allowlisting and semantic decoding of every target, selector, argument, value, and nested call. |
| Malicious router or bridge calldata | Select approved providers, decode calldata independently, bind route economics, reject arbitrary multicalls/delegatecalls and unexpected callbacks. |
| Allowance abuse, Permit, or Permit2 misuse | Exact-token, exact-spender, exact-amount, expiring authorization; avoid unlimited approvals and revoke residual allowance when the chosen flow requires it. |
| Fee, gas, slippage, or recipient manipulation | Server-authoritative limits, current executable pricing, bounded gas, minimum output, exact recipient and token binding, and final revalidation. |
| Contract or token substitution | Exact chain-aware addresses and bytecode/proxy policy; symbol or name is never authority. |
| Proxy and upgradeability risk | Pin approved proxy/admin/implementation expectations, monitor upgrades, pause on drift, and review governance authority. |
| Bridge risk | Provider-specific finality, refund, validator, liquidity, upgrade, and destination-execution analysis; strict exposure caps. |
| Oracle or pricing manipulation | Independent executable-price confidence checks, freshness limits, bounded price impact, and fail-closed provider disagreement. |
| Fee-on-transfer, rebasing, ERC-777/hook, or malicious tokens | Deny by default; support only after behavior-specific accounting, simulation, and adversarial tests. |
| Native wrapping/unwrapping | Exact wrapped-native contracts, amounts, recipients, refund behavior, and balance-delta reconciliation. |
| Reentrancy | Prefer no custom contracts; if introduced, minimize external calls/state and require reentrancy analysis, tests, and audit. |
| MEV and front-running | Tight deadlines/slippage, private submission where justified, minimum outcomes, and no claim of guaranteed ordering. |
| RPC inconsistency, reorg, and finality | Multiple observations where warranted, chain-specific confirmation policy, durable pending states, and reorg-aware reconciliation. |
| Relayer griefing or sponsor drain | Independent relayer policy, global/wallet/action/transaction caps, reservations, rate limits, low-balance shutdown, and emergency pause. |
| Denial of service and rate-limit bypass | Authenticated identities, distributed counters/locks, bounded payloads, timeouts, concurrency limits, and degraded fail-closed behavior. |
| Log or secret leakage | Structured allowlisted telemetry, recursive redaction, no calldata/signatures/credentials by default, and restricted operational access. |
| Admin/operator compromise | Least privilege, separate sponsor and treasury roles, hardware/remote signing, change controls, monitoring, caps, and rapid pause/rotation. |

Reconciliation must be idempotent and compare authoritative balance and receipt effects. Ambiguous network outcomes remain pending until resolved; they must not trigger duplicate sponsorship.
