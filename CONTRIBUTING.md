# Contributing

Four people, seventeen build days (28 Nov → 14 Dec freeze), one fresh-install demo. These rules exist so nobody
blocks or overwrites anybody. Read this once, fully, before your first PR.

## Who owns what

The primary owner decides and reviews; the backup can merge if the primary is unavailable for a day.
This is the proposed split; issue assignment on GitHub is the final word.

| #   | Area                                                     | Paths                                                              | Primary     | Backup   |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------ | ----------- | -------- |
| 1   | Repo infra, CI/CD, deploys, install link                 | `.github/`, `scripts/`, root config                                | **Harsh**   | Sristee  |
| 2   | Forge manifest, triggers, queues                         | `manifest.yml`, `src/index.ts`, `src/triggers.ts`                  | **Harsh**   | Sristee  |
| 3   | Core service and storage                                 | `src/core/`                                                        | **Harsh**   | Sristee  |
| 4   | Rovo + MCP action handlers                               | `src/actions/`                                                     | **Harsh**   | Sikruti  |
| 5   | All UI: issue panel, conflict card, badge, ledger, setup | `src/frontend/`, `src/resolver.ts`                                 | **Harsh**   | Sikruti  |
| 6   | The frozen contract                                      | `src/core/contract.ts`                                             | **Harsh**   | Sristee  |
| 7   | Permissions, security checklist                          | `src/permissions/`, `SECURITY.md`                                  | **Sristee** | Harsh    |
| 8   | Workflow validator, negative cases, fresh-install test   | `src/guard/validator.ts`, `test/enforcement*`, `test/permissions*` | **Sristee** | Harsh    |
| 9   | Capture pre-filter, prompts, schemas, model client       | `src/capture/`, `src/ai/`                                          | **Sumedha** | Sikruti  |
| 10  | Rule checkers                                            | `src/rules/`                                                       | **Sumedha** | Harsh    |
| 11  | Evaluation set and report                                | `eval/`, `docs/evals/`                                             | **Sumedha** | Sristee  |
| 12  | Rovo agent prompt and conversation design                | `src/agent/`                                                       | **Sumedha** | Sikruti  |
| 13  | Sample workspace seeding                                 | `src/seed/`                                                        | **Sikruti** | Sristee  |
| 14  | Agent rules export format, `SKILL.md`                    | `skills/`, export renderer                                         | **Sikruti** | Harsh    |
| 15  | Judge instructions, demo script, video, Devpost          | `docs/JUDGE_TESTING.md`, `docs/DEMO.md`, README pitch              | **Sikruti** | everyone |

Two splits that are not obvious:

- **Harsh owns the UI and the core.** The UI is built against `src/core/contract.ts` with mocked responses from
  day one, so the screens and the service move in parallel. Sikruti is the UI backup if the core slips.
- **Sristee co-owns the contract.** Permissions touch every function in it, so every contract change needs both
  Harsh and Sristee (CODEOWNERS enforces it).

## Spec first

Anything that changes behaviour other people depend on starts as a spec.

1. Copy `docs/specs/TEMPLATE.md` to `docs/specs/NNNN-short-name.md` (next free number).
2. Open a PR with status **Proposed**. Owners of affected areas review.
3. Merge as **Accepted**. Implement in follow-up PRs that link the spec. Move it to **In Progress**, then **Done**.

Skip the spec for bug fixes, refactors inside one folder, docs, tests and dependency bumps.
CI fails a PR that touches `src/core/contract.ts` or `manifest.yml` without a `docs/specs/NNNN` link in its
description.

## The frozen contract

`src/core/contract.ts` is the only place shared types live. Every surface (panel, ledger, validator, Rovo
actions, MCP tools) calls the core service through it, which is what keeps permissions and verdicts identical
everywhere. A new field goes through a spec and a PR reviewed by Harsh and Sristee, announced in the team chat
before merge. Do not copy a type into your folder "for now".

## The ledger: acceptance criteria as tests

Every acceptance criterion that is not built yet is a real test wrapped in `ledger()`:

```ts
import { ledger } from "./ledger.js";

ledger("M2", "sumedhag28", "api_convention: /api/refunds conflicts with the /v2 rule", async () => {
  const out = await core.checkProposal(owner, {
    scope: "project:NWP",
    text: "Add refund endpoint at /api/refunds",
  });
  expect(out.verdict).toBe("conflict");
});
```

- It runs as `test.fails`: green today because the assertion fails.
- When you build the feature, the assertion passes and the test turns **red**. Change `ledger(...)` to
  `test(...)` (drop the milestone and owner) in the same PR. Nobody can claim "done" without the test agreeing.
- CI prints a Milestone × Owner burndown from these entries on every run (job summary of the `ci` workflow).
- Calling `test.fails` directly is a lint error; use `ledger()` so the burndown can attribute it.
- Owners and milestones are typed (`src/shared/team.ts`). A typo is a compile error.

## Branches and pull requests

```bash
git switch main && git pull
git switch -c feat/guard-freshness-key     # feat/ fix/ docs/ chore/ test/ refactor/ ci/
```

- **Never push to `main`.** It is protected. Even a one-line fix is a PR.
- **One PR, one concern.** A PR that touches four areas is four PRs.
- **CI must be green** (`ci` and `hygiene`) and the branch up to date with `main`.
- **One approval to merge.** Any teammate can approve, then the author merges. Don't wait on one person; ask in
  the chat.
- **Admin override.** Harsh (repo admin) can merge without an approval when something is urgent, such as a broken
  `main` or a judge-blocking fix. It's for emergencies, not routine work; still open the PR so the change is
  reviewed afterwards.
- **Squash merge.** The PR title becomes the commit message, so it must be a Conventional Commit:
  `feat(guard): include decision revisions in the freshness key`. Lowercase subject, no trailing period.
- **Rebase when you drift:** `git pull --rebase origin main`.
- **Resolve every review conversation** before merging.

## Commits

- Conventional Commits in the imperative: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `perf`, `ci`.
- Commit often; a visible history matters for the hackathon (the rules require the app to be built after
  27 October 2026).
- Commits are authored by the person who wrote them. **No co-author trailers or "generated with" lines for
  tools**; CI rejects them.

## Definition of done

- `bun run lint && bun run typecheck && bun run test && bun run manifest:check` pass; no test was weakened.
- New behaviour has a test; finished ledger entries became plain tests.
- Every UI state you touched is built: empty, checking, restricted, inconclusive, error (judges score Design on
  completeness).
- The spec matches what was built (update it in the same PR if it changed).
- Stayed in your area, or the owner approved the crossing.
- Nothing committed is a secret, credential, `.env`, personal app id or large binary.

## Working locally

```bash
bun install
bun run test            # all tests, including ledger entries
bun run test:ci && bun run ledger   # see the burndown
bun run manifest:check  # offline manifest checks (forge lint needs a login)
```

Forge itself (login, register, tunnel, deploy) is in [docs/SETUP.md](docs/SETUP.md).

## When you are stuck

Say so in the team chat within 30 minutes, with what you tried. A blocked person is the most expensive thing in a
seventeen-day build.
