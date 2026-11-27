# Specs

Write the spec, agree on it, then build it. Two people building in parallel without a written agreement build two
incompatible things.

## Lifecycle

**Proposed** → **Accepted** → **In Progress** → **Done** (or **Superseded** / **Rejected**)

- _Proposed:_ PR open, owners of affected areas reviewing.
- _Accepted:_ merged; the interfaces are the contract. Code PRs link it.
- _In Progress:_ first implementation PR merged.
- _Done:_ every acceptance criterion is a plain passing test (no `ledger()` entries left for it).

Changing an Accepted spec is a PR to the spec first, reviewed by the same owners, then the code.

## When you need one

Need one: changes to `src/core/contract.ts`, `manifest.yml` modules, action inputs, storage entities, queue
payloads, anything two areas both touch. Skip: bug fixes, refactors inside one folder, docs, tests, dependency
bumps.

## Index

All ten were drafted from the technical specification (26 Nov) with the review findings folded in
([PROJECT.md §6](../PROJECT.md#6-review-findings-and-where-they-are-fixed)), and are reviewed in M0.

| #                                         | Spec                                                | Owner              | Reviewers                                 | Milestone | Status   |
| ----------------------------------------- | --------------------------------------------------- | ------------------ | ----------------------------------------- | --------- | -------- |
| [0001](0001-decision-lifecycle.md)        | Decision model, lifecycle and approval authority    | @harshkumarsingh12 | @srshriv, @sumedhag28                     | M2        | Proposed |
| [0002](0002-core-service.md)              | Core service contract                               | @harshkumarsingh12 | @srshriv, @sumedhag28, @hoursgotviral-dev | M2        | Proposed |
| [0003](0003-capture.md)                   | Capture pipeline                                    | @sumedhag28        | @harshkumarsingh12                        | M2        | Proposed |
| [0004](0004-guard-and-rule-checks.md)     | Guard, rule checkers, freshness and coverage        | @sumedhag28        | @harshkumarsingh12, @srshriv              | M2        | Proposed |
| [0005](0005-enforcement.md)               | Enforcement: workflow validator and resolution      | @srshriv           | @harshkumarsingh12                        | M3        | Proposed |
| [0006](0006-agents-and-mcp.md)            | Rovo agent, actions, MCP tools, rules export, skill | @harshkumarsingh12 | @hoursgotviral-dev, @sumedhag28           | M3        | Proposed |
| [0007](0007-permissions-security-cost.md) | Permissions, security and cost controls             | @srshriv           | @harshkumarsingh12                        | M3        | Proposed |
| [0008](0008-ui.md)                        | UI: conflict card, panel, badge, ledger, setup      | @harshkumarsingh12 | @hoursgotviral-dev, @srshriv              | M3        | Proposed |
| [0009](0009-ai-and-evaluation.md)         | AI pipeline and evaluation                          | @sumedhag28        | @harshkumarsingh12, @srshriv              | M3        | Proposed |
| [0010](0010-sample-workspace-and-demo.md) | Sample workspace, demo and submission               | @hoursgotviral-dev | everyone                                  | M5        | Proposed |
