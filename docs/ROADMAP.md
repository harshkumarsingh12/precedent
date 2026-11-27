# Roadmap

GitHub milestones M0–M5 mirror the sections below; every issue carries one. Status here is updated by the owner in
the PR that finishes the deliverable. The live burndown of unbuilt acceptance criteria is in the job summary of
every `ci` run.

## M0 Foundations (29 Nov)

| Deliverable                                               | Owner           | Status |
| --------------------------------------------------------- | --------------- | ------ |
| Repo, CI/CD, branch protection, backlog                   | Harsh           | ✅     |
| Specs 0001–0010 reviewed and Accepted                     | each spec owner |        |
| Forge app registered; deploy secrets set                  | Harsh           |        |
| Each person has a Forge demo site with Rovo               | everyone        |        |
| Hello-world panel deployed to the shared development site | Harsh           |        |
| Devpost team created; all four registered                 | Sikruti         |        |

**Done when:** specs Accepted, the panel renders on the shared site, CI green on `main`.

## M1 Spike go/no-go (2 Dec)

| Deliverable                                                                                    | Owner   | Status |
| ---------------------------------------------------------------------------------------------- | ------- | ------ |
| Install from a production share link on a second site as a non-contributor                     | Sristee |        |
| Comment and update triggers reach a queue consumer                                             | Harsh   |        |
| Forge LLM returns valid JSON for one extraction prompt; latency and cost recorded              | Sumedha |        |
| Capture end to end: "we decided public APIs live under /v2" → proposed decision with the quote | Sumedha |        |
| Rule conflict end to end: `/api/refunds` work item shows a conflict                            | Harsh   |        |
| Validator added to a transition and blocks with our message                                    | Sristee |        |
| One action callable from the Rovo agent and from a Rovo Studio agent via `rovo:mcp`            | Harsh   |        |
| Action reads a work item as the invoking user; a user without access is denied                 | Sristee |        |
| Sample-workspace scopes confirmed                                                              | Sikruti |        |

**Done when:** every must-pass test passes, or the team switches to CAPA Replay on 3 Dec and does not switch again.

## M2 Core loop (9 Dec)

M1–M6 and M8: record, capture, confirm with approvers, typed rules, guard with freshness, conflict card, ledger.
First 60 evaluation cases.
**Done when:** editing the seeded refund work item raises a rule conflict with both quotes and its evidence.

## M3 Feature freeze (14 Dec)

M7 and M9–M14: validator, Rovo agent, MCP tools, rules export with publication approval, skill file, permissions
on every surface, sample workspace, 100 cases with a held-out set. Security and cost reviews.
**Done when:** a Rovo Studio agent calls `get_decisions` on a fresh install. No features after this date.

## M4 Fresh install (17 Dec)

Bug fixes, every UI state, negative cases, final evaluation run on frozen thresholds.
**Done when:** the fresh-install script in [JUDGE_TESTING.md](JUDGE_TESTING.md) passes as a non-contributor.

## M5 Submission (20 Dec)

Video, description, technology explanation, bonus write-ups, judge instructions, repo README with measured numbers.
**Done when:** submitted on Devpost and the confirmation email is received.
