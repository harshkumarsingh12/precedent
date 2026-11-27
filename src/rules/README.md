# rules

One deterministic checker per decision kind: `tech-choice.ts`, `data-policy.ts`, `api-convention.ts`, `process-rule.ts`, each exporting `check(rule, { text?, diff? }): CheckResult`. Every conflict carries the matched evidence; when intent or data flow can't be established, return `inconclusive`.

Spec: [0004](../../docs/specs/0004-guard-and-rule-checks.md) · Owner: @sumedhag28 · Backup: @harshkumarsingh12
