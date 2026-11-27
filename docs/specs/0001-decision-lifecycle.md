# 0001: Decision model, lifecycle and approval authority

|               |                       |
| ------------- | --------------------- |
| **Status**    | Proposed              |
| **Owner**     | @harshkumarsingh12    |
| **Reviewers** | @srshriv, @sumedhag28 |
| **Milestone** | M2                    |
| **Issues**    |                       |

## Context

A decision is the binding object Precedent enforces. The technical specification (§9.1, M1, M3) let "any user who
can open the source" confirm a decision and become its owner, while M3 reserved confirmation for the named owner.
Review finding 2 calls that ambiguous: a source reader could publish a site-wide rule. Finding 5 adds that
supersession with overlapping scopes can silently retire a broader policy. [PROJECT.md §6](../PROJECT.md).

## Design

### States

| From     | Action                                                  | To                               | Who                                                            |
| -------- | ------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------- |
| —        | record (form, Rovo, MCP, capture)                       | proposed                         | anyone who can open the source; triggers as the app            |
| proposed | confirm (with optional edits to statement, rule, scope) | accepted                         | an **approver for every scope key** of the decision            |
| proposed | reject                                                  | rejected                         | an approver, or the person who recorded it                     |
| accepted | supersede (new statement + reason, **identical scope**) | superseded (old), accepted (new) | an approver for the scope                                      |
| accepted | expire / review-by passed                               | expired                          | the owner or an approver; the S6 sweep returns it to the owner |
| accepted | change scope                                            | accepted, revision + 1           | an approver for every scope **added**                          |

Every transition writes an audit entry and bumps `revision`; accepted decisions with a new revision make stored
verdicts stale (spec 0004).

### Approval authority (finding 2)

| Scope level              | Approvers (default)                                                         | Configured in |
| ------------------------ | --------------------------------------------------------------------------- | ------------- |
| `site`                   | Jira administrators, plus accounts/groups listed in `config:approvers.site` | setup page    |
| `project:<KEY>`          | that project's administrators, plus `config:approvers.project[KEY]`         | setup page    |
| `component:<KEY>/<name>` | approvers of `project:<KEY>`, plus the component lead                       | Jira          |
| `repo:<slug>`            | approvers of every project mapped to the repo in `config:scopes`            | setup page    |

Enforced in `core` for confirm, supersede and scope widening. The UI only hides buttons; it is never the check.
The confirming approver becomes `ownerAccountId`.

### Supersession (finding 5)

- MVP: the new decision's `scopeKeys` must equal the old decision's. Otherwise `scope_mismatch`.
- When two accepted decisions overlap in scope and disagree, the guard reports `inconclusive` with reason
  `ambiguous_intent` and the ledger lists the pair under "Needs an owner".

## Interfaces

`Decision`, `DecisionStatus`, `ApproverPolicy`, `ConfirmDecisionInput`, `SupersedeDecisionInput` in
`src/core/contract.ts`. Errors thrown by core carry a `code`: `not_an_approver`, `scope_mismatch`,
`reason_required`, `invalid_transition`. Storage: `decision`, `scope-index`, `evidence` entities;
`counter:decision`, `config:approvers`.

## Acceptance criteria

1. `recordDecision` always creates `proposed`, never `accepted`, on every surface.
2. A project approver can confirm a project rule.
3. A source reader can propose a rule but `confirmDecision` rejects them with `not_an_approver`.
4. Neither a project approver nor a source reader can confirm or widen a decision to `site` without site approval.
5. Superseding requires a reason and links old and new both ways; the old one appears only as history.
6. A promotions-only rule cannot supersede the loyalty-wide DEC-4 (`scope_mismatch`); ordinary points still use DEC-4.
7. Every transition writes an audit entry with user, origin and time.

## Out of scope

Superseding with a narrower or broader scope (post-hackathon: split or merge flow). Group-based project approvers
beyond Jira project roles.

## Open questions

- Can the app read project admin membership as the user in all contexts? (@srshriv, 2 Dec spike)
