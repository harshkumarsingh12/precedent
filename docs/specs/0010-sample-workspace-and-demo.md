# 0010: Sample workspace, demo and submission

|               |                    |
| ------------- | ------------------ |
| **Status**    | Proposed           |
| **Owner**     | @hoursgotviral-dev |
| **Reviewers** | everyone           |
| **Milestone** | M5                 |
| **Issues**    |                    |

## Context

Judges install on their own sites, which start empty (objection 5). Winners set themselves up. The demo must use
decisions with real stakes (objection 8) and show only what a judge can reproduce (finding 9). Technical
specification §11.6, §16, §21.

## Design

### Sample workspace (one idempotent button)

1. Create project **Northwind Payments** (`NWP`) with components loyalty, checkout, platform, finance.
2. Create ~12 work items and comments: four comments containing decisions, two conflicting specs, two look-alikes,
   one restricted work item holding a fifth decision.
3. Run capture on the seeded comments so four proposed decisions wait for confirmation.
4. Show a three-step guide: confirm the decisions, open the conflicting spec, ask the Rovo agent a "why" question.
5. A second click detects the project and offers Reset.

| Id    | Statement                                                                                     | Kind           | Scope                                         |
| ----- | --------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------- |
| DEC-1 | No customer email addresses or phone numbers in application logs.                             | data_policy    | site                                          |
| DEC-2 | All public API routes are versioned under /v2.                                                | api_convention | project:NWP                                   |
| DEC-3 | Product services call the payments gateway service. No direct Stripe SDK in product services. | tech_choice    | component:NWP/loyalty, component:NWP/checkout |
| DEC-4 | Loyalty points never expire.                                                                  | free_text      | component:NWP/loyalty                         |

| Work item                                                    | Purpose                                           |
| ------------------------------------------------------------ | ------------------------------------------------- |
| "Loyalty points service" spec: points expire after 12 months | Conflict with DEC-4 (model judge)                 |
| "Add refund endpoint at /api/refunds"                        | Conflict with DEC-2 (rule, with evidence)         |
| "Log failed logins for debugging" (no personal data)         | Look-alike for DEC-1; must be ok                  |
| "Evaluate Stripe pricing for 2027" (finance)                 | Look-alike for DEC-3; out of scope; must not fire |
| Restricted work item with a fifth decision                   | Restricted-user behaviour                         |

### Video (4:45)

| Time      | Scene                                                                                                                                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0:00–0:25 | Hook: "Your team decided this in March. Your coding agent was never told."                                                                                                                                                                                               |
| 0:25–1:05 | Capture: load the workspace; a comment becomes a proposed decision; an approver confirms; ledger shows four.                                                                                                                                                             |
| 1:05–2:00 | Guard and lifecycle: the loyalty spec conflicts with DEC-4; the product lead supersedes it with a reason and the **same loyalty scope** → DEC-6; history shows why.                                                                                                      |
| 2:00–2:35 | Enforcement: the refund item is blocked by the configured validator; the pending-check behaviour is shown; the author fixes the path, it rechecks, the transition succeeds.                                                                                              |
| 2:35–3:40 | Agents: a **Rovo Studio agent** with the Precedent tools reads the decisions, exports the AGENTS.md block, and its proposed diff adding the Stripe SDK gets an **advisory** conflict with DEC-3. An external client appears only if its setup passed on a fresh install. |
| 3:40–4:10 | Ask and permissions: a new joiner asks why payments go through the gateway; a restricted user sees "1 restricted decision applies"; look-alikes are not flagged.                                                                                                         |
| 4:10–4:45 | Close: measured numbers from the holdout set with counts; Runs on Atlassian; the two bonus entries.                                                                                                                                                                      |

### Submission checklist

App deployed to production, share link created, not submitted to the Marketplace; `llm` module and all scopes
present before the link is shared; `app.rovo` metadata defined and a test redeploy succeeds; fresh-install test
passed on 17 Dec as a non-contributor; daily model cap funded through 3 Feb 2027; judge instructions; category and
bonus write-ups naming `rovo:mcp`, `rovo:agent`, `action` and the open-source skill; honest limits; all four
teammates added; video public, under 5:00, no copyrighted music.

## Interfaces

`seedSampleWorkspace(): Promise<{ projectKey, created, proposedDecisions }>` in `src/seed/`.

## Acceptance criteria

1. One click on a fresh site creates NWP with four proposed decisions; a second click duplicates nothing.
2. The two conflicts and the two look-alikes behave as in the table after confirmation.
3. The fresh-install script passes as a non-contributor on a second site.
4. Every scene in the video is reproducible from JUDGE_TESTING.md, and the narration matches what is shown.

## Out of scope

Bootstrap import (S3).

## Open questions

- Scopes needed to create a project and components (`manage:jira-project`?) (@hoursgotviral-dev, 2 Dec).
- Does showing a third-party coding tool on screen conflict with the trademark rule? Ask on the Devpost forum (@hoursgotviral-dev, 10 Dec).
