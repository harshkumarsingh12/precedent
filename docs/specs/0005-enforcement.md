# 0005: Enforcement: workflow validator and conflict resolution

|               |                    |
| ------------- | ------------------ |
| **Status**    | Proposed           |
| **Owner**     | @srshriv           |
| **Reviewers** | @harshkumarsingh12 |
| **Milestone** | M3                 |
| **Issues**    |                    |

## Context

Jira blocks a guarded transition while a conflict is open. Required Bitbucket merge checks need Premium and a
separate app, so the Jira validator is the enforcement point (objections 3 and 10). Review finding 4: Follow was
recorded as a resolution while the validator only blocked open conflicts. Finding 3: the example message named a
rule some viewers cannot read. Technical specification §11.3, §15.6.

## Design

### Validator `precedent-no-open-conflicts`

1. Receives the issue key and transition. **No model call.**
2. Calls `getIssueState` as the transitioning user.
3. Recomputes the freshness key (0004). If stale, runs rule checkers inline and queues the judge.
4. Any check with verdict `conflict` and resolution `open` → `{ result: false, errorMessage }`.
5. Only a model check pending → allow (default, _lenient_) or block with "Precedent is still checking this work
   item. Try again in a moment." (_strict_, admin setting).
6. Storage failure → allow (default _fail-open_) or block with "Precedent could not check this work item"
   (_fail-closed_).
7. Otherwise `{ result: true }`.

### Message (finding 3)

Rendered for the viewer:

| Viewer can open the decision's source | Message                                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Yes                                   | "Blocked by DEC-3 (no customer emails in logs). Open the Precedent panel to follow, supersede or dismiss."      |
| No                                    | "Blocked by 1 restricted decision. Ask the decision owner, or open the Precedent panel for who can resolve it." |

### Resolution actions on the conflict card (finding 4)

| Action        | Effect                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Follow**    | Opens the work-item editor at the conflicting passage. The check stays `open`. After the edit, the guard reruns; when the passage no longer conflicts, the check becomes `followed`. |
| **Supersede** | Opens the supersede form (0001): new statement, reason, identical scope.                                                                                                             |
| **Dismiss**   | Requires a note; who may dismiss: owner, a project admin, or anyone if the admin enabled open resolution. The case is added to the evaluation log.                                   |

## Interfaces

`validateTransition(input) => { result, errorMessage? }` in `src/guard/validator.ts`.
`ResolveCheckInput.action: "follow" | "dismiss"`. `config:guard = { mode: "lenient" | "strict", failure:
"open" | "closed", openResolution: boolean, threshold: number }`.

## Acceptance criteria

1. An open conflict blocks the guarded transition.
2. Click Follow, close the editor, retry: still blocked. Correct the passage, recheck, retry: succeeds.
3. A dismissal without a note is rejected (`note_required`); with a note, the transition succeeds.
4. A dismissed conflict stays dismissed while the same passage remains and reopens if it changes.
5. A restricted user's block message contains no decision text or statement.
6. Strict mode blocks while a model check is pending; lenient mode allows it and the panel says so.

## Out of scope

Bitbucket merge checks. Automatically adding the validator to workflows.

## Open questions

- Can the app detect whether the validator is attached to any workflow? If not, the setup page shows a manual
  checklist. (@srshriv, 2 Dec)
