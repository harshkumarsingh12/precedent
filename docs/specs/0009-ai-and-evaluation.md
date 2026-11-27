# 0009: AI pipeline and evaluation

|               |                              |
| ------------- | ---------------------------- |
| **Status**    | Proposed                     |
| **Owner**     | @sumedhag28                  |
| **Reviewers** | @harshkumarsingh12, @srshriv |
| **Milestone** | M3                           |
| **Issues**    |                              |

## Context

The model is used in exactly three places, each fenced by rules before and validation after. Impact must be shown,
not claimed (objection 9), so we publish measured numbers. Review finding 8: the plan tuned thresholds and reported
scores on the same fixtures. Technical specification §12.

## Design

### Where the model is used

| Task                  | Input                                 | Output (strict JSON)                                              | Fence                                                        |
| --------------------- | ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| Extract a decision    | one comment + two of context          | statement, rationale, kind, rule, scopeHints[], quote, confidence | pre-filter before; schema + quote-is-substring after         |
| Propose a rule        | a confirmed or manual statement       | kind, rule                                                        | owner reviews and edits before it is enforced                |
| Judge a contradiction | target text + ≤10 free-text decisions | per decision: verdict, confidence, targetQuote, reason            | scope filter before; both quotes substrings; threshold after |

### Prompt rules

Temperature 0; JSON only, validated with a schema library; one retry then `inconclusive`. Captured text is
delimited as data with an instruction to ignore instructions inside it. A conflict is defined narrowly: the target
proposes or requires what the decision forbids, or omits what it requires; a mention is ok. The judge returns
inconclusive when ambiguous and is told a wrong conflict costs more than a missed one. Model family `claude` via
the `llm` module; the smallest model meeting the targets.

### Thresholds

Capture confidence 0.70 · judge confidence to show a conflict 0.80 · ≤10 decisions per judge call · daily token
cap set from spike costs.

### Evaluation set (finding 8)

Two disjoint sets in `eval/fixtures/`: **tuning** (used to set thresholds and prompts) and **holdout** (frozen on
13 Dec, sealed by a hash in `eval/fixtures/holdout.sha256`, never used for tuning). Each set has sanitized
tickets, near misses and examples for every kind.

| Group                                       | Tuning | Holdout |
| ------------------------------------------- | ------ | ------- |
| Extraction: real decisions                  | 14     | 8       |
| Extraction: look-alikes                     | 10     | 6       |
| Rule checkers: true violations, per kind    | 12     | 8       |
| Rule checkers: near misses                  | 12     | 8       |
| Judge: true contradictions                  | 10     | 6       |
| Judge: same topic, no contradiction         | 8      | 6       |
| Lifecycle: superseded, expired, wrong scope | 6      | 4       |
| **Total**                                   | **72** | **46**  |

### Metrics and targets (on holdout, frozen thresholds)

Rule precision ≥ 0.95 · rule recall ≥ 0.90 · judge precision ≥ 0.85 at the chosen threshold · judge recall
reported honestly, ≥ 0.70 · lifecycle 100%. Published with counts of **false blocks, missed conflicts and
inconclusive results**, the case counts and the thresholds. If a target is missed, report the real number and
narrow the feature, not the claim.

## Interfaces

`eval/run.ts --set tuning|holdout` prints the table and writes `docs/evals/<date>-<set>.{md,json}`.
`src/ai/` exports `extractDecision`, `proposeRule`, `judge`, each returning a schema-validated result or
`inconclusive`.

## Acceptance criteria

1. The holdout hash check fails the run if a holdout fixture changed after the freeze.
2. No holdout fixture id appears in tuning logs or threshold commits.
3. The published counts reproduce from the frozen fixtures with `bun run eval -- --set holdout`.
4. An invalid model response is retried once, then recorded as inconclusive.

## Out of scope

Practitioner trial (optional; reported as a small trial with its sample size if done).

## Open questions

- Cost per extraction and per judge call in Forge LLM credits (@sumedhag28, 2 Dec).
