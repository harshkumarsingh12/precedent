# Conventions

Small rules that prevent the bugs that cost a day to find.

## Data

- **Decision ids** are `DEC-<n>` from the `counter:decision` key. Never reuse a number.
- **Scope keys** are `site`, `project:<KEY>`, `component:<KEY>/<name>`, `repo:<slug>`. Lowercase component names
  and slugs; project keys as Jira gives them.
- **Time** is epoch seconds (integer) in storage. Pure code takes `now` as a parameter (it is on `Ctx`); only the
  edges (handlers, triggers) read the clock.
- **Hashes** are lowercase hex SHA-256 over normalised text (trimmed, `\r\n` → `\n`).
- **Revisions**: a decision's `revision` increases on every change to statement, rule or scope.

## Verdicts

- Three values only: `conflict`, `ok`, `inconclusive`. A failure of any kind is `inconclusive` with a reason,
  never `ok`.
- A rule conflict always carries the matched `evidence`. Rule results never carry a made-up confidence.
- An overall `ok` requires full coverage (`src/core/verdict.ts`).

## Surfaces

- No surface reads storage directly. Everything goes through `core`.
- `accountId` comes from the Forge context. Never from a payload field.
- Text the user sees never contains internal names (`ScopeIndex`, `targetHash`). Plain language, and every status
  has a word, not only a colour.
- Every screen builds its empty, checking, restricted, inconclusive and error states.

## Prompts

- Temperature 0, JSON only, validated with a schema; one retry, then `inconclusive`.
- Ticket, comment and page text is wrapped in delimiters and labelled as data. Instructions inside it are ignored.
- Every quote the model returns must be a substring of its source, or the result is dropped.

## Code

- TypeScript strict everywhere. No `any` without a comment saying why.
- A stub throws `NotImplementedError(what, owner, spec)` so a half-built path names who to ask.
- File names are kebab-case; React components PascalCase; unit tests sit next to the code as `*.test.ts`;
  acceptance criteria live in `test/` as `ledger()` entries.
- Log through `console` with the invocation id; never log decision text from restricted sources, prompts or
  model output above debug.

## Git

See [CONTRIBUTING.md](../CONTRIBUTING.md): branch per change, Conventional Commit PR titles, squash merge, one
approval, never push to `main`, no tool attribution in commits.
