## What and why

<!-- One concern per PR. Link the issue: "Closes #12". -->

Closes #

## Spec

<!-- Required if you touched src/core/contract.ts or manifest.yml (CI checks this). -->

docs/specs/

## Definition of done

- [ ] Checks pass locally (`bun run lint && bun run typecheck && bun run test && bun run manifest:check`)
- [ ] New behaviour has a test; no test was weakened to make this pass
- [ ] Ledger entries this PR completes are converted from `ledger()` to `test()`
- [ ] Spec updated if behaviour differs from it (and status moved if needed)
- [ ] Every UI state touched is handled (empty, checking, restricted, inconclusive, error)
- [ ] Stayed in my area, or the owner of the other area approved
- [ ] No secrets, credentials, `.env`, app ids from personal sites or large binaries committed

## How I tested it

<!-- Unit tests, and for Forge changes: site, environment, and what you clicked. -->

## Screenshots (UI changes)

## Contract impact

None.
