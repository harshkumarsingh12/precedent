# 0006: Rovo agent, actions, MCP tools, rules export and skill file

|               |                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Status**    | Proposed                                                                                                           |
| **Owner**     | @harshkumarsingh12 (actions, rovo:mcp) · @hoursgotviral-dev (export format, SKILL.md) · @sumedhag28 (agent prompt) |
| **Reviewers** | @hoursgotviral-dev, @sumedhag28                                                                                    |
| **Milestone** | M3                                                                                                                 |
| **Issues**    |                                                                                                                    |

## Context

One set of actions serves both bonus entries: Best Agents (`rovo:agent`, `action`) and Best app with Atlassian MCP
(`rovo:mcp` + an open-source skill file). Review finding 3: the export could copy a private decision into a shared
repository. Finding 9: agent diff checks are advisory, and the external client in the video was a stretch item.
Technical specification §11.4, §13.

## Design

### Actions

| Key                  | Verb   | Inputs                        | Returns                                                                            | Rovo agent | MCP |
| -------------------- | ------ | ----------------------------- | ---------------------------------------------------------------------------------- | ---------- | --- |
| `get-decisions`      | GET    | scope*                        | accepted decisions in scope: id, statement, kind, owner, date                      | ✓          | ✓   |
| `check-proposal`     | GET    | scope*, text, diff            | verdict, per-decision results with quotes and evidence, coverage, `advisory: true` | ✓          | ✓   |
| `record-decision`    | CREATE | statement*, scope*, rationale | proposed decision id and a link to confirm it                                      | ✓          | ✓   |
| `export-agent-rules` | GET    | scope*, format                | the marked rules block, `withheldCount`                                            |            | ✓   |
| `explain-decision`   | GET    | query*                        | decision, evidence links, history                                                  | ✓          |     |

Handler rules: identity from context only; validate every input (model-extracted); a malformed scope falls back to
the Jira context; origin `rovo` or `mcp`; compact JSON well under 5 MB. Confirming and superseding are **not**
actions; they happen in the Jira panel.

### Rules export and publication approval (finding 3)

- Accepted decisions are published to a repository only after an approver for that `repo:<slug>` scope approves
  publication on the ledger ("Publish to loyalty-service"). Stored as `publishedTo: string[]` on the decision.
- `exportAgentRules` returns only decisions published to that repo **and** readable by the caller; the rest are
  counted in `withheldCount`.
- Output: a block between `<!-- precedent:start -->` and `<!-- precedent:end -->`, one rule per line (statement,
  id, owner display name), a header with the generation time and "do not edit by hand". Formats `agents_md`
  (AGENTS.md, CLAUDE.md) and `rovodev_review` (`.rovodev/.review-agent.md`).
- When a published decision changes, the ledger marks the repo's rules out of date.

### Demo and judged path (finding 9)

The judged path is a **Rovo Studio agent** with the Precedent tools on a fresh install. An external client (Claude
Code, Cursor) is shown only after its setup passes on a fresh install, and is labelled optional. Agent diff checks
are described as advisory; Jira enforcement is the configured validator.

## Interfaces

Manifest `action`, `rovo:agent`, `rovo:mcp` modules; `skills/precedent/SKILL.md`; `ExportAgentRulesOutput`,
`CheckProposalOutput.advisory` in the contract.

## Acceptance criteria

1. `get_decisions` called from a Rovo Studio agent on a fresh install returns the accepted NWP decisions.
2. `record_decision` from MCP creates a proposed decision; the response says it must be confirmed in Jira.
3. `export_agent_rules` renders only published, readable decisions between the markers; unpublished ones are
   counted in `withheldCount`.
4. A user with repository access but no access to the Jira source gets no text from that decision.
5. `check_proposal` from MCP returns `advisory: true`.
6. The Rovo agent cites id, owner, date and link, and says when no decision covers the question.

## Out of scope

Committing to repositories (the coding agent writes the file). Bitbucket apps.

## Open questions

- Exact tool names the Atlassian MCP server exposes for our action keys; match SKILL.md (@harshkumarsingh12, 2 Dec).
- Required `app.rovo` metadata fields (@harshkumarsingh12, before 14 Dec).
