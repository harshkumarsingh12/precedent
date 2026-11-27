# Evaluation fixtures

Two disjoint sets (spec [0009](../../docs/specs/0009-ai-and-evaluation.md), review finding 8):

| Folder     | Use                           | Rule                                                               |
| ---------- | ----------------------------- | ------------------------------------------------------------------ |
| `tuning/`  | Set prompts and thresholds    | Change freely until 13 Dec                                         |
| `holdout/` | Final, published numbers only | Frozen on 13 Dec; `holdout.sha256` seals it; never used for tuning |

One JSON file per case:

```json
{
  "id": "rule-api-001",
  "group": "rule_true_violation",
  "kind": "api_convention",
  "decision": {
    "statement": "All public API routes are versioned under /v2.",
    "rule": { "kind": "api_convention", "pathMustMatch": "^/v2/", "appliesToPrefix": "/" }
  },
  "target": { "text": "Add refund endpoint at /api/refunds" },
  "expected": "conflict"
}
```

Tickets are sanitized: no real names, emails, company identifiers or customer data.
