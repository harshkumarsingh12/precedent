/**
 * THE frozen contract. Every surface (issue panel, ledger, validator, Rovo actions, MCP tools) talks to the
 * core service through these types and nothing else. Changing this file needs a spec (docs/specs/0002) and a
 * review from both @harshkumarsingh12 and @srshriv; CI fails a PR that touches it without a spec link.
 *
 * Source: Technical Specification §9–10, with the review findings folded in (docs/PROJECT.md §6).
 */

// ── Decisions ────────────────────────────────────────────────────────────────────────────────────────────

export type DecisionKind = "tech_choice" | "data_policy" | "api_convention" | "process_rule" | "free_text";

export type DecisionStatus = "proposed" | "accepted" | "superseded" | "expired" | "rejected";

/** `site`, `project:PAY`, `component:PAY/loyalty`, `repo:loyalty-service`. */
export type ScopeKey = string;

export type SourceType = "issue" | "comment" | "page" | "manual" | "agent";

export interface DecisionSource {
  type: SourceType;
  issueKey?: string;
  commentId?: string;
  pageId?: string;
  url?: string;
}

/** Machine-checkable parameters per kind (spec 0004). Empty for free_text. */
export type DecisionRule =
  | { kind: "tech_choice"; forbidTerms: string[]; forbidPackages: string[]; preferred?: string }
  | { kind: "data_policy"; sinkPatterns: string[]; fieldPatterns: string[] }
  | { kind: "api_convention"; pathMustMatch: string; appliesToPrefix?: string }
  | { kind: "process_rule"; requiredPhrase?: string; requiredField?: string }
  | { kind: "free_text" };

export interface Decision {
  /** Human-readable, `DEC-<n>`. */
  id: string;
  statement: string;
  rationale?: string;
  kind: DecisionKind;
  rule: DecisionRule;
  status: DecisionStatus;
  /** The approver who confirmed it; required once accepted. */
  ownerAccountId?: string;
  scopeKeys: ScopeKey[];
  /** Bumped on every change to statement, rule or scope (finding 1: freshness). */
  revision: number;
  decidedAt?: number;
  createdAt: number;
  updatedAt: number;
  reviewBy?: number;
  supersedes?: string;
  supersededBy?: string;
  supersedeReason?: string;
  source: DecisionSource;
  /** Extraction confidence for captured candidates; 1 for manual. */
  confidence: number;
}

export interface Evidence {
  decisionId: string;
  sourceType: SourceType;
  sourceRef: string;
  url?: string;
  quote: string;
  capturedAt: number;
}

// ── Checks and verdicts ──────────────────────────────────────────────────────────────────────────────────

export type Verdict = "conflict" | "ok" | "inconclusive";

/** Why a result is inconclusive. Never reported as ok (spec §10.3 rule 3). */
export type InconclusiveReason =
  | "model_unavailable"
  | "cap_reached"
  | "read_failed"
  | "low_confidence"
  | "ambiguous_intent" // finding 6
  | "unsupported_analysis" // finding 6: e.g. a value assigned outside the analysed lines
  | "not_checked"; // finding 7: over the per-call budget and not batched yet

/** `followed` only after a fresh check confirms the passage was corrected (finding 4). */
export type Resolution = "open" | "followed" | "superseded" | "dismissed";

export type Origin = "panel" | "trigger" | "rovo" | "mcp" | "ci" | "validator";

/**
 * Everything a verdict depends on. A stored verdict is reused only when every part matches
 * (finding 1): the text, the resolved scope and each applicable decision's revision.
 */
export interface FreshnessKey {
  textHash: string;
  scopeKeys: ScopeKey[];
  decisionRevisions: Record<string, number>;
}

export interface Check {
  targetType: "issue" | "page" | "proposal";
  targetRef: string;
  freshness: FreshnessKey;
  /** Monotonic per target; a job that finishes with an older sequence is discarded (finding 1). */
  sequence: number;
  decisionId: string;
  verdict: Verdict;
  reason?: InconclusiveReason;
  method: "rule" | "model";
  /** Model confidence; rule results carry evidence instead of a fake 1.0 (finding 6). */
  confidence?: number;
  /** The exact matched passage that justifies a rule conflict (finding 6). */
  evidence?: string;
  targetQuote?: string;
  decisionQuote?: string;
  resolution: Resolution;
  resolvedBy?: string;
  resolvedAt?: number;
  resolutionNote?: string;
  origin: Origin;
}

export interface CheckResult {
  decisionId: string;
  verdict: Verdict;
  reason?: InconclusiveReason;
  method: "rule" | "model";
  confidence?: number;
  evidence?: string;
  targetQuote?: string;
  decisionQuote?: string;
}

export interface Coverage {
  /** Every decision that applies to the target. */
  applicable: number;
  /** How many of them produced a conflict or ok result. */
  checked: number;
  unchecked: string[];
}

// ── Context ──────────────────────────────────────────────────────────────────────────────────────────────

export interface Ctx {
  /** From the resolver or action context. Never from a model-extracted input. */
  accountId: string | null;
  origin: Origin;
  /** Whether a user-context API client is available. Triggers have none and only write proposals. */
  asUser: boolean;
  now: number;
}

// ── Authority (finding 2) ────────────────────────────────────────────────────────────────────────────────

export type ScopeLevel = "site" | "project" | "component" | "repo";

/** Who may confirm, supersede or widen a decision at each scope level. Enforced in core, never in the UI. */
export interface ApproverPolicy {
  site: { accountIds: string[]; groupIds: string[] };
  /** By default a project admin; overridable per project key. */
  project: Record<string, { accountIds: string[] }>;
}

// ── Core service ─────────────────────────────────────────────────────────────────────────────────────────

export interface GetDecisionsInput {
  scope: string;
  status?: DecisionStatus;
  includeHistory?: boolean;
}
export interface GetDecisionsOutput {
  decisions: Decision[];
  hiddenCount: number;
}

export interface CheckProposalInput {
  text?: string;
  diff?: string;
  scope: string;
  targetRef?: string;
}
export interface CheckProposalOutput {
  verdict: Verdict;
  results: CheckResult[];
  coverage: Coverage;
  hiddenCount: number;
  /** Agent diff checks are advisory: Jira enforces only on configured transitions (finding 9). */
  advisory: boolean;
}

export interface RecordDecisionInput {
  statement: string;
  rationale?: string;
  kind?: DecisionKind;
  scope: string;
  source: DecisionSource;
}

export interface ConfirmDecisionInput {
  id: string;
  edits?: Partial<Pick<Decision, "statement" | "rationale" | "kind" | "rule" | "scopeKeys" | "reviewBy">>;
}

export interface SupersedeDecisionInput {
  id: string;
  newStatement: string;
  reason: string;
  rule?: DecisionRule;
  /** Must equal the old decision's scope in the MVP (finding 5). */
  scopeKeys: ScopeKey[];
}

export interface ResolveCheckInput {
  targetRef: string;
  decisionId: string;
  /** `follow` opens the editor and keeps the check open (finding 4); it is not a resolution by itself. */
  action: "follow" | "dismiss";
  note?: string;
}

export interface ExplainDecisionInput {
  query?: string;
  id?: string;
}
export interface ExplainDecisionOutput {
  decision: Decision | null;
  evidence: Evidence[];
  history: Decision[];
}

export type AgentRulesFormat = "agents_md" | "rovodev_review";

export interface ExportAgentRulesInput {
  /** A repository scope, `repo:<slug>`. */
  scope: string;
  format: AgentRulesFormat;
}
export interface ExportAgentRulesOutput {
  markdown: string;
  decisionIds: string[];
  /** Applicable decisions not yet approved for publication to this repository (finding 3). */
  withheldCount: number;
  generatedAt: number;
}

export type IssueState = "clear" | "conflicts" | "checking" | "inconclusive" | "unknown";

export interface IssueStateOutput {
  state: IssueState;
  openConflicts: CheckResult[];
  coverage: Coverage;
  stale: boolean;
  hiddenCount: number;
}

export interface CoreService {
  getDecisions(ctx: Ctx, input: GetDecisionsInput): Promise<GetDecisionsOutput>;
  checkProposal(ctx: Ctx, input: CheckProposalInput): Promise<CheckProposalOutput>;
  recordDecision(ctx: Ctx, input: RecordDecisionInput): Promise<{ decision: Decision }>;
  confirmDecision(ctx: Ctx, input: ConfirmDecisionInput): Promise<{ decision: Decision }>;
  supersedeDecision(
    ctx: Ctx,
    input: SupersedeDecisionInput,
  ): Promise<{ oldDecision: Decision; newDecision: Decision }>;
  resolveCheck(ctx: Ctx, input: ResolveCheckInput): Promise<{ check: Check }>;
  explainDecision(ctx: Ctx, input: ExplainDecisionInput): Promise<ExplainDecisionOutput>;
  exportAgentRules(ctx: Ctx, input: ExportAgentRulesInput): Promise<ExportAgentRulesOutput>;
  getIssueState(ctx: Ctx, input: { issueKey: string }): Promise<IssueStateOutput>;
}
