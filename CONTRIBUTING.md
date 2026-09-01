# Contributing

GASLESS EVM is currently a security-first architecture foundation.

1. Open an issue before proposing a new chain, protocol, dependency, or contract.
2. Keep changes narrow and avoid speculative integrations or production addresses.
3. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
4. Document threat-model and authorization-boundary changes.

Never commit secrets, RPC credentials, signer material, or operational configuration. Security reports belong in GitHub private vulnerability reporting, not issues.
