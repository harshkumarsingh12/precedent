# 0004: Guard, rule checkers, freshness and coverage

|               |                                                                                     |
| ------------- | ----------------------------------------------------------------------------------- |
| **Status**    | Proposed                                                                            |
| **Owner**     | @sumedhag28 (rule checkers, judge) · @harshkumarsingh12 (guard pipeline, freshness) |
| **Reviewers** | @harshkumarsingh12, @srshriv                                                        |
| **Milestone** | M2                                                                                  |
| **Issues**    |                                                                                     |

## Context

The guard turns accepted decisions into verdicts on work items and agent proposals. Three review findings change
the technical specification (§11.2, §9.6, §12): verdicts went stale when a rule or component changed (finding 1),
pattern matches could block "remove Stripe" (finding 6), and more than ten free-text decisions left the verdict
undefined (finding 7).

## Design

### When it runs

On work-item create, on any update that changes the **freshness key**, and on demand from the panel, Rovo or MCP.

### Freshness key (finding 1)

`{ textHash(summary + description), scopeKeys (sorted), decisionRevisions: { DEC-n: revision } }`.
The trigger recomputes it on `avi:jira:updated:issue` (including component changes); a mismatch queues a guard
job. Every job carries a per-target `sequence` taken when it was queued; when it finishes, it writes only if its
sequence is the latest. The validator recomputes the key at transition time (0005).

### Steps

1. Resolve scope keys: `site`, `project:<KEY>`, each `component:<KEY>/<name>`, mapped `repo:<slug>` from `config:scopes`.
2. Load accepted decisions for those keys from ScopeIndex. None → state `clear`.
3. Run the rule checker for every typed decision.
4. Batch free-text decisions to the judge, at most 10 per call, as many calls as the budget allows.
5. Record `coverage = { applicable, checked, unchecked[] }`.
6. Overall verdict (`src/core/verdict.ts`): conflict if any; else inconclusive if any inconclusive **or any
   unchecked**; else ok.
7. Write Check rows with the freshness key and sequence. A previous resolution is kept only while the same passage
   still matches; a new passage reopens the check.

### Rule checkers (finding 6)

| Kind           | Rule fields                                      | Blocks (conflict)                                                                                                | Inconclusive                                                                                  | Never flags                                             |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| tech_choice    | `forbidTerms[]`, `forbidPackages[]`, `preferred` | An **added** line in a dependency file naming a forbidden package; spec text proposing to adopt a forbidden term | Prose that mentions the term without clear intent                                             | Removed lines; negations ("remove Stripe", "no Stripe") |
| data_policy    | `sinkPatterns[]`, `fieldPatterns[]`              | An added line where a sink and a field appear together                                                           | A sink logging a variable whose origin is outside the analysed lines (`unsupported_analysis`) | Logging without a field pattern                         |
| api_convention | `pathMustMatch`, `appliesToPrefix`               | A new route or spec path under the prefix that does not match                                                    | Paths built dynamically                                                                       | Paths outside the prefix                                |
| process_rule   | `requiredPhrase` / `requiredField`               | A work item missing the element when moving to a guarded status                                                  | —                                                                                             | —                                                       |
| free_text      | —                                                | Judge says conflict above the threshold, both quotes are substrings                                              | Below threshold, ambiguous, or model failure                                                  | Topic merely mentioned                                  |

Every rule conflict carries `evidence` (the matched passage). Rule results carry no confidence number.

## Interfaces

`FreshnessKey`, `Check`, `CheckResult`, `Coverage`, `InconclusiveReason` in `src/core/contract.ts`. Queue payload
`{ issueKey, sequence }`. Checkers: `src/rules/<kind>.ts` exporting
`check(rule, { text?, diff? }) => CheckResult`.

## Acceptance criteria

1. `/api/refunds` conflicts with DEC-2 and the result's evidence contains the path.
2. Adding `stripe` to a dependency file conflicts with DEC-3; removing it does not; "should we drop Stripe?" is
   ok or inconclusive, never conflict.
3. Pass a ticket, accept a conflicting rule, re-run without editing: the stored ok is stale and the new verdict
   is conflict. Same after adding a component.
4. A job queued earlier that finishes later does not overwrite a newer result.
5. Eleven free-text decisions with a violation in the eleventh: verdict is conflict or inconclusive with
   `unchecked` listing it, never ok.
6. A model failure gives inconclusive (`model_unavailable`); rule results still stand.
7. A superseded, expired, proposed or out-of-scope decision never fires.

## Out of scope

Data-flow analysis across files. AST parsing of diffs (line-based with honest `unsupported_analysis`).

## Open questions

- Budget of judge calls per guard run before `not_checked` (@sumedhag28, after the cost spike).
