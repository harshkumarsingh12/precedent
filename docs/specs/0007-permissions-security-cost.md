# 0007: Permissions, security and cost controls

|               |                    |
| ------------- | ------------------ |
| **Status**    | Proposed           |
| **Owner**     | @srshriv           |
| **Reviewers** | @harshkumarsingh12 |
| **Milestone** | M3                 |
| **Issues**    |                    |

## Context

Past winners lean on permission-aware behaviour. Precedent copies text out of Jira into panels, chat, MCP and
repository files, so one rule governs every read: **a decision is never more visible than the place it came
from.** Technical specification §14; review finding 3.

## Design

### Permission model

| Rule                              | Implementation                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visibility follows the source     | Before returning a decision, core checks the acting user can open its source (Jira work item or Confluence page, read as the user). 403/404 hides it. |
| Hidden decisions still protect    | They take part in checks; the user sees "1 restricted decision applies; ask its owner", no text; counted in `hiddenCount`.                            |
| Manual decisions                  | Take the visibility of the work item they were recorded on, or a chosen project.                                                                      |
| Who can confirm, supersede, widen | Approvers per scope (spec 0001).                                                                                                                      |
| Who can dismiss                   | The owner, a project admin, or anyone if open resolution is enabled.                                                                                  |
| Triggers have no user             | Background runs only create proposals and Check rows; never expose text.                                                                              |
| Cache                             | Per user and source for a few minutes; resolution actions always re-check.                                                                            |
| Leaving Jira                      | Validator messages (0005) and rules exports (0006) are rendered for the viewer and require publication approval.                                      |

### Security requirements

No external egress · captured text is data in every prompt · schema-validated model output, never executed ·
quotes are substrings of sources · inputs never used for authorization · least scopes · append-only audit log with
the true origin (Rovo-driven changes can show the invoking person in Jira history) · `ci-check` web trigger (S5)
off by default with a secret in Forge encrypted variables · `forge-security-review` and `forge-app-review` before
the freeze.

### Cost controls

Rules before models · comment pre-filter · freshness key (no re-check when nothing changed) · ≤10 free-text
decisions per judge call · daily token cap per site in `config:guard` (results become `inconclusive`,
`cap_reached`) · smallest adequate model chosen from evaluation · no Rovo calls from background jobs · today's
usage on the setup page · `forge-cost-optimizer` once before the freeze.

## Interfaces

`src/permissions/` exports `canReadSource(ctx, source): Promise<boolean>` and
`filterVisible(ctx, decisions): Promise<{ visible, hiddenCount }>`. Storage key `usage:<yyyy-mm-dd>`.

## Acceptance criteria

1. A restricted user sees no text from a decision whose source they cannot open, in the panel, ledger, Rovo, MCP,
   validator message and export.
2. A restricted decision still produces a conflict on a work item the user can see; the card shows the
   restricted state.
3. An action input naming another `accountId` has no effect on authorization.
4. When the cap is reached, model results are `inconclusive` with `cap_reached`, and the setup page says so.
5. `forge eligibility` reports Runs on Atlassian with the `llm` module present.

## Out of scope

Field-level security. Confluence permissions (with S1/S2).

## Open questions

- Is a user-context API client available inside MCP tool invocations? If not, restrict MCP results to decisions
  with site- or project-wide sources the app can verify. (@srshriv, 2 Dec spike)
