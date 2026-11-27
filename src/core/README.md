# core

The only code that reads or writes decisions and checks. Every surface calls these functions.

- `contract.ts`: the frozen contract (spec [0002](../../docs/specs/0002-core-service.md)); changes need a spec link and review from @harshkumarsingh12 and @srshriv.
- `verdict.ts`: overall verdict with coverage (spec [0004](../../docs/specs/0004-guard-and-rule-checks.md)).
- `index.ts`: the service; stubs name their owner until built.

Owner: @harshkumarsingh12 · Backup: @srshriv
