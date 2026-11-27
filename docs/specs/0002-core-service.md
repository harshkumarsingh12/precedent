# 0002: Core service contract

|               |                                           |
| ------------- | ----------------------------------------- |
| **Status**    | Proposed                                  |
| **Owner**     | @harshkumarsingh12                        |
| **Reviewers** | @srshriv, @sumedhag28, @hoursgotviral-dev |
| **Milestone** | M2                                        |
| **Issues**    |                                           |

## Context

Every surface (panel, ledger, validator, Rovo actions, MCP tools) calls the same functions in `src/core/`. No
surface reads storage directly. This is what keeps permissions and verdicts identical everywhere (technical
specification §10). The contract is frozen once Accepted; the UI is built against it with mocks from day one.

## Design

| Function                                                                 | Returns                                                  | Notes                                                                                                                                                                                |
| ------------------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getDecisions(ctx, { scope, status?, includeHistory? })`                 | `{ decisions, hiddenCount }`                             | Resolves the scope to scope keys, queries ScopeIndex, filters by source access (0007) and, for `repo:` scopes, by publication approval (0006). Default status `accepted`.            |
| `checkProposal(ctx, { text?, diff?, scope, targetRef? })`                | `{ verdict, results, coverage, hiddenCount, advisory }`  | Rules first, then the judge for free text (0004). Stores Check rows only when called from the guard or resolver path, not from a GET action. `advisory` is true for agent/MCP calls. |
| `recordDecision(ctx, …)`                                                 | `{ decision }` (proposed)                                | The model proposes kind and rule when missing.                                                                                                                                       |
| `confirmDecision(ctx, { id, edits? })`                                   | `{ decision }` (accepted)                                | Approver check (0001).                                                                                                                                                               |
| `supersedeDecision(ctx, { id, newStatement, reason, rule?, scopeKeys })` | `{ oldDecision, newDecision }`                           | Identical scope in MVP.                                                                                                                                                              |
| `resolveCheck(ctx, { targetRef, decisionId, action, note? })`            | `{ check }`                                              | `follow` keeps the check open (0005); `dismiss` needs a note and is added to the evaluation log.                                                                                     |
| `explainDecision(ctx, { query or id })`                                  | `{ decision, evidence, history }`                        | Applies the precedence rule.                                                                                                                                                         |
| `exportAgentRules(ctx, { scope, format })`                               | `{ markdown, decisionIds, withheldCount, generatedAt }`  | Approved-for-repo decisions only (0006).                                                                                                                                             |
| `getIssueState(ctx, { issueKey })`                                       | `{ state, openConflicts, coverage, stale, hiddenCount }` | Used by the badge, panel and validator.                                                                                                                                              |

### Context

`Ctx = { accountId, origin, asUser, now }`. `accountId` comes from the Forge invocation context
(`src/shared/context.ts`), never from an input. Triggers have no user: `asUser = false`, they only write proposals
and Check rows and never expose text.

### Errors

| Situation                    | Behaviour                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Storage read fails           | Typed error; UI shows retry; validator blocks with "could not check" only in fail-closed mode (default fail-open) |
| Model call fails / times out | `inconclusive`, reason `model_unavailable`; rule results stand                                                    |
| Daily spend cap reached      | Judge skipped; `inconclusive`, reason `cap_reached`; setup page shows the cap                                     |
| Source no longer exists      | Decision stays, marked "source removed"; visible only to owner and admins until re-linked                         |

## Interfaces

[`src/core/contract.ts`](../../src/core/contract.ts) is the interface. Changes need this spec updated and review
from @harshkumarsingh12 and @srshriv.

## Acceptance criteria

1. No module outside `src/core/` imports `@forge/api` storage (lint rule added with the first storage code).
2. Each function's `ctx.accountId` is taken from the context in every handler (unit test per handler).
3. A failure of any kind produces `inconclusive` with a reason, never `ok`.
4. The UI screens run against a mock `CoreService` in unit tests.

## Out of scope

Pagination beyond the first 100 decisions per scope (sample and judge workspaces are small).

## Open questions

- Does a GET action that stores a check result behave correctly? Current answer: don't store from GET actions. (@harshkumarsingh12, 2 Dec)
