# Precedent: project document

This is the arbiter. When a spec, an issue and a chat message disagree, this document wins until a PR changes it.
It condenses the team's _Precedent Technical Specification for Codegeist 2026_ (26 Nov 2026, 55 pages) and folds
in the nine findings from _Precedent Issues and Recommended Fixes_ (§6). Scope changes need all four people to
agree and are written here.

## 1. One line

**Decisions your agents cannot ignore: tracked, checked, enforced.** A Forge app that records the decisions a team
has made, checks new specs, pull requests and agent plans against them, and blocks or flags work that contradicts
one until a person resolves the conflict.

## 2. Hackathon facts

| Item              | Value                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event             | [Codegeist 2026](https://codegeist2026.devpost.com)                                                                                                                              |
| Category          | Apps for Software Teams                                                                                                                                                          |
| Bonus entries     | Best app with Atlassian MCP (lead), Best Agents. A submission can win only one bonus.                                                                                            |
| Platform          | Forge: Jira (required), Rovo, Forge LLMs; Confluence optional (stretch)                                                                                                          |
| Official deadline | 22 Dec 2026, 12:00 PT = **23 Dec, 1:30 am IST**                                                                                                                                  |
| Team deadline     | Feature freeze **14 Dec**; fresh-install test **17 Dec**; submit **20 Dec** IST                                                                                                  |
| Judging           | 5 Jan – 3 Feb 2027; winners ~15 Feb 2027                                                                                                                                         |
| Must submit       | Installation link, public YouTube video under 5 min (no third-party trademarks or copyrighted music), testing instructions, description, technology explanation, bonus write-ups |
| Eligibility       | Built on Forge after 27 Oct 2026; all materials in English; installs on a judge's site and works as shown                                                                        |
| Fallback          | CAPA Replay (Apps for Specialized Industries) only if the M1 spike fails                                                                                                         |

Judging: stage one pass/fail on theme and required APIs; stage two scores five equal criteria (Technological
Implementation, Design, Potential Impact, Innovation, Presentation); ties go to Technological Implementation.

## 3. Positioning

- **Against Jira Planner:** Planner writes the spec. Precedent holds decisions as records with owners and status,
  checks every spec and agent plan against them, and blocks the work item until a conflict is resolved.
- **Against AGENTS.md:** Precedent generates the file's rules block from approved decisions and keeps it current,
  so each rule has an owner, a reason, a review date and a history.
- **Precedence rule:** accepted decision > ticket or page text; superseding decision > the one it replaced;
  expired and superseded decisions are history, never enforced.

Users: tech lead (records once, sees violations early), PM writing a spec (conflict card on the work item),
engineer with a coding agent (agent fetches rules over MCP), new joiner (Rovo agent answers "why"), engineering
manager (ledger of decisions and resolutions).

## 4. Scope

### MVP (must ship by 14 Dec)

| #   | Feature                                                             | Spec       |
| --- | ------------------------------------------------------------------- | ---------- |
| M1  | Record a decision by hand from a Jira work item                     | 0001       |
| M2  | Detect decision candidates in Jira comments                         | 0003       |
| M3  | Confirm, edit, supersede, dismiss, expire, with per-scope approvers | 0001       |
| M4  | Typed decisions with deterministic rule checkers                    | 0004       |
| M5  | Guard on Jira work items: conflict, ok, inconclusive                | 0004       |
| M6  | Conflict card in the issue panel (Follow, Supersede, Dismiss)       | 0005, 0008 |
| M7  | Jira workflow validator                                             | 0005       |
| M8  | Decision ledger page                                                | 0008       |
| M9  | Rovo agent with actions                                             | 0006       |
| M10 | MCP tools through `rovo:mcp`                                        | 0006       |
| M11 | Agent rules export and skill file                                   | 0006       |
| M12 | Permission-aware reads on every surface                             | 0007       |
| M13 | Sample workspace and setup page                                     | 0010, 0008 |
| M14 | Evaluation report on ≥100 labelled cases with a held-out set        | 0009       |

### Stretch (only after the freeze exit checks are green)

S1 Confluence capture · S2 guard on Confluence pages · S3 bootstrap import · S4 external MCP client demo ·
S5 CI pipeline check web trigger · S6 review-by reminders.

### Cut

Agent-readiness score, spec writing, lineage diagram, Teamwork Graph, Bitbucket merge check (one Forge app cannot
span Jira and Bitbucket; required checks need Premium), GitHub webhook, Marketplace listing.

## 5. Architecture in one paragraph

One Forge app. Triggers (`avi:jira:created|updated|commented:issue`) push jobs to async queues so model calls run
outside the trigger time limit. A single `core/` service is the only code that reads or writes decisions and
checks; the UI resolvers, the workflow validator, the Rovo actions and the MCP tools all call it, so permissions
and verdicts are identical everywhere. Rule checkers run first; Forge LLM (`claude`) is called only for free-text
decisions. Data lives in Forge custom entities: Decision, ScopeIndex, Evidence, Check, plus config, usage and an
append-only audit log. See [ARCHITECTURE.md](ARCHITECTURE.md) and [specs](specs/README.md).

## 6. Review findings and where they are fixed

The review's first priority: **make Jira enforce current decisions, limit who can approve them, and protect their
source permissions when results leave Jira.**

| #   | Finding                                                                                      | Fix (binding)                                                                                                                                                                    | Spec             | Acceptance test                                                                                                                                   |
| --- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A clear verdict can go stale: the hash covers ticket text only; an older job can finish last | Freshness key = text hash + resolved scope + each applicable decision's revision; verify at transition time; discard results with an older sequence                              | 0004             | Pass a ticket, accept a conflicting rule, retry the transition unedited → blocks. Repeat after a component change and an out-of-order job.        |
| 2   | Approval authority is ambiguous: any source reader could confirm a site-wide rule            | Approvers per scope level (site, project, component, repo), enforced in core for confirm, supersede and scope widening                                                           | 0001             | Project approver confirms a project rule; source reader can only propose; neither publishes a site-wide rule without site approval.               |
| 3   | Restricted decisions can reach a wider audience via the export and the validator message     | Explicit per-repository publication approval; validator messages rendered with the viewer's permissions                                                                          | 0006, 0005, 0007 | Two users with repo access, one with Jira source access: unapproved rule stays out of the export; restricted user's message reveals no rule text. |
| 4   | Follow can be mistaken for resolution                                                        | Follow opens the editor; the conflict stays open until a fresh check confirms the passage was corrected                                                                          | 0005             | Follow, close the editor, retry → still blocks. Correct, recheck → succeeds.                                                                      |
| 5   | A narrow exception can replace a broader policy                                              | MVP: supersession only with identical scope; overlapping disagreeing rules surface as ambiguity for an owner                                                                     | 0001             | Promotions-only rule cannot supersede the loyalty-wide rule; ordinary points keep the original policy.                                            |
| 6   | A pattern match can produce a false block                                                    | Show matched evidence; hard-block only verifiable changes (e.g. adding a forbidden dependency); inconclusive when intent or data flow can't be established; no fake confidence 1 | 0004             | Add / remove / ambiguous-prose fixtures: only the addition blocks; out-of-coverage logging surfaces the limit.                                    |
| 7   | The guard may skip applicable rules (≤10 free-text per call)                                 | Track every applicable decision; batch within budget; any unchecked → inconclusive unless a confirmed conflict already decides                                                   | 0004             | Eleven rules, violation in the eleventh → conflict found or coverage gap disclosed; never a clear ok.                                             |
| 8   | Accuracy targets lack an independent test set                                                | Separate tuning and held-out sets; freeze thresholds before the final run; publish false-block, missed and inconclusive counts                                                   | 0009             | Thresholds frozen first; no held-out case used for tuning; published counts reproduce from frozen fixtures.                                       |
| 9   | The pitch overstates where enforcement happens                                               | Show the configured Jira block; label agent checks advisory; Rovo Studio is the required demo path; external clients only after a fresh-install setup works                      | 0006, 0010       | On a fresh site: transition blocks a known conflict, pending-check behaviour shown, Rovo Studio agent retrieves a decision; narration matches.    |

Consequences for the demo (spec 0010): the DEC-4 → DEC-6 supersede keeps the identical `component:NWP/loyalty`
scope (finding 5); fresh-install step "resolve by following" means _edit and recheck_ (finding 4); the agents scene
uses a Rovo Studio agent, with an external client shown only if it passes a fresh-install setup (finding 9).

## 7. Plan

| Dates (IST)  | Milestone             | Exit check                                                                                                                                                                                                                |
| ------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 28–29 Nov    | **M0 Foundations**    | Repo, CI, specs reviewed; each person has a Forge demo site with Rovo; hello-world panel deployed                                                                                                                         |
| 30 Nov–2 Dec | **M1 Spike go/no-go** | Install via share link on a second site as a non-contributor; triggers reach the queue; Forge LLM returns JSON; one action callable from Rovo and from Rovo Studio via MCP; action reads a work item as the invoking user |
| 3–9 Dec      | **M2 Core loop**      | M1–M6, M8; editing the seeded refund work item raises a rule conflict with both quotes; first 60 eval cases                                                                                                               |
| 10–14 Dec    | **M3 Feature freeze** | M7, M9–M14; a Rovo Studio agent calls `get_decisions` on a fresh install; 100 cases; security and cost reviews                                                                                                            |
| 15–17 Dec    | **M4 Fresh install**  | Every UI state, negative cases, final evaluation; fresh-install test passes as a non-contributor                                                                                                                          |
| 18–20 Dec    | **M5 Submission**     | Video, description, bonus write-ups, judge instructions; submitted 20 Dec                                                                                                                                                 |
| 21–22 Dec    | Buffer                | No new features                                                                                                                                                                                                           |
| 5 Jan–3 Feb  | Judging               | App stays deployed, model cap funded, no redeploys unless judge-blocking                                                                                                                                                  |

## 8. Risks

| Risk                                                    | L   | I        | Mitigation                                                                                        |
| ------------------------------------------------------- | --- | -------- | ------------------------------------------------------------------------------------------------- |
| False conflicts annoy users and judges                  | H   | H        | Rules first; evidence shown; inconclusive over guessing; threshold; published precision           |
| Judge installs but can't reproduce                      | M   | Critical | Sample workspace; setup health checks; fresh-install test 17 Dec; step-by-step judge instructions |
| "Jira Planner again"                                    | M   | H        | Lead with guard, lifecycle, enforcement; no spec writing                                          |
| Validator needs admin setup and is Preview              | H   | M        | Guide on the setup page; panel and badge show block state anyway                                  |
| No user-context client in MCP invocations               | M   | H        | Test in spike; else restrict MCP results to site/project-sourced decisions the app can verify     |
| Forge LLM cost through judging                          | M   | L        | Pre-filter, freshness check, daily cap, smallest adequate model                                   |
| Deploys blocked after 5 Jan without `app.rovo` metadata | L   | H        | Add metadata before submission; test a redeploy                                                   |
| Scope creep                                             | H   | H        | MVP frozen after the spike; stretch only after exit checks                                        |

## 9. Open questions (answer in the spike, owner in brackets)

Time limits for triggers, consumers and validators [Harsh] · cost of one extraction and one judge call [Sumedha] ·
required `app.rovo` fields [Harsh] · GET action that stores a check result [Harsh] · detecting validator usage
[Sristee] · MCP tool names exposed for our action keys [Harsh] · custom-entity index limits [Harsh] · scopes needed
to create the sample project [Sikruti] · trademark rule and third-party tools on screen [Sikruti].
