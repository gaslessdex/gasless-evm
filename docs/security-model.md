# Security model

The sponsor must never become an arbitrary-call wallet. A request is eligible only when its chain, action, wallet, recipient, token, target contract, calldata semantics, value, route, deadline, nonce, and maximum sponsored cost match server-issued policy.

The future implementation must provide EIP-712 domain separation, chain-aware replay locks, bounded nonces and expiry, current-state revalidation, call simulation, gas ceilings, token and target allowlists, rate limits, emergency pauses, finality-aware confirmation, idempotent reconciliation, and redacted telemetry. Any mismatch or unavailable critical check fails closed.

Sponsorship reimbursement and GASLESS service fees are separate economic concepts. Both must be quoted and reconciled from authoritative execution data before any network is enabled.

These are architectural requirements, not claims of implemented execution. The current code implements only foundational request checks, caps, replay-key derivation, configuration validation, redaction, and explicit non-execution.
