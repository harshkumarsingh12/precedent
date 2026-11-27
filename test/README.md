# test

Acceptance criteria as tests. Each unbuilt criterion is a `ledger(milestone, owner, title, fn)` entry (see [CONTRIBUTING.md](../CONTRIBUTING.md#the-ledger-acceptance-criteria-as-tests)); one file per spec area. Unit tests live next to the code as `*.test.ts`.

`bun run test:ci && bun run ledger` prints the Milestone × Owner burndown.
