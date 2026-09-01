# Architecture

One shared TypeScript core serves every EVM-compatible network. A small chain adapter supplies verified chain configuration and future execution behavior; action modules will express BRIDGE, SWAP, and SEND policy without duplicating the application.

```text
request → policy and schema validation → chain adapter → construction
        → simulation → user authorization → exact revalidation
        → bounded sponsorship → submission → confirmation → reconciliation
```

The server, not the browser, will select targets, calldata, value, gas policy, fees, and routes. The wallet may authorize only the reviewed semantics. Robinhood Chain is first; Base and BNB Chain exercise the same adapter boundary.

No custom GASLESS contract is assumed. Existing audited protocols and off-chain orchestration are preferred. A contract requires a concrete unmet need, an explicit authority/custody analysis, tests, and an audit plan.
