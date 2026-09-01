# Transaction lifecycle

The planned lifecycle is:

1. Authenticate the wallet and read current chain state.
2. Validate the action, chain, assets, recipient, and eligibility.
3. Select only approved routers or bridges and produce exact economics.
4. Construct server-authoritative calldata and simulate it.
5. Present the complete outcome and obtain scoped, expiring user authorization.
6. Recheck chain ID, domain, nonce, state, calldata, targets, gas, limits, and signature.
7. Have the relayer independently validate and sponsor the same semantics.
8. Simulate/preflight again; on failure, do not broadcast.
9. Submit once, confirm to the chain-specific finality policy, and reconcile idempotently.

Material changes require a new request and new authorization. Replays, ambiguous submissions, and reorgs require durable state rather than blind resubmission.
