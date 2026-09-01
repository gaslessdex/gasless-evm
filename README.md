# GASLESS EVM

Shared EVM execution architecture for GASLESS.

**EVM — BRIDGE · SWAP · SEND**

This repository is an architectural foundation, not a live transaction service. Robinhood Chain is the first implementation target; Base and BNB Chain are planned. No adapter currently constructs, signs, sponsors, or broadcasts transactions.

| Network | Actions | Status |
| --- | --- | --- |
| Robinhood Chain | BRIDGE · SWAP · SEND | First implementation target |
| Base | BRIDGE · SWAP · SEND | Planned |
| BNB Chain | BRIDGE · SWAP · SEND | Planned |
| Other EVM networks | BRIDGE · SWAP · SEND | Extensible |

## Foundation

The TypeScript core defines typed chain configuration, a shared adapter registry, request-policy validation, replay-key derivation, bounded sponsorship checks, and log redaction. Every placeholder adapter fails closed. Chain IDs, RPC endpoints, routers, bridges, tokens, relayers, and contracts remain unset until verified during implementation.

No EVM runtime library is needed at this stage. `viem` is the preferred first candidate when verified transaction encoding and RPC work begins; wallet UI and contract toolchains will be added only if a concrete requirement justifies them.

## Security direction

The intended lifecycle is server-authoritative: validate policy, construct an exact request, simulate, obtain narrowly scoped user authorization, revalidate state and calldata, sponsor within fixed limits, submit identical authorized semantics, confirm, and reconcile idempotently. See [the security model](docs/security-model.md) and [threat model](docs/threat-model.md).

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Configuration examples are placeholders only. They do not enable execution.

## Project

- Website: [gasless.exchange](https://gasless.exchange)
- Solana V1: [gaslessdex/gasless](https://github.com/gaslessdex/gasless)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security reports: [SECURITY.md](SECURITY.md)

Licensed under [Apache-2.0](LICENSE).
