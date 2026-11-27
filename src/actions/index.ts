import { core } from "../core/index";
import { toCtx, type ForgeInvocationContext } from "../shared/context";
import type { AgentRulesFormat } from "../core/contract";

/**
 * Rovo and MCP action handlers. Inputs are model-extracted and can be wrong: validate them, and never use them
 * for authorization. The acting user always comes from the invocation context (spec 0006, 0007).
 */
type Payload = Record<string, unknown> & { context?: ForgeInvocationContext };

const origin = (p: Payload) => (p.context && "mcp" in p.context ? "mcp" : "rovo") as "mcp" | "rovo";
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export const actionGetDecisions = (p: Payload, c?: ForgeInvocationContext) =>
  core.getDecisions(toCtx(c ?? p.context, origin(p)), { scope: str(p.scope) });

export const actionCheckProposal = (p: Payload, c?: ForgeInvocationContext) =>
  core.checkProposal(toCtx(c ?? p.context, origin(p)), {
    scope: str(p.scope),
    text: str(p.text) || undefined,
    diff: str(p.diff) || undefined,
  });

export const actionRecordDecision = (p: Payload, c?: ForgeInvocationContext) =>
  core.recordDecision(toCtx(c ?? p.context, origin(p)), {
    statement: str(p.statement),
    rationale: str(p.rationale) || undefined,
    scope: str(p.scope),
    source: { type: "agent" },
  });

export const actionExportAgentRules = (p: Payload, c?: ForgeInvocationContext) =>
  core.exportAgentRules(toCtx(c ?? p.context, origin(p)), {
    scope: str(p.scope),
    format: (str(p.format) === "rovodev_review" ? "rovodev_review" : "agents_md") as AgentRulesFormat,
  });

export const actionExplainDecision = (p: Payload, c?: ForgeInvocationContext) =>
  core.explainDecision(toCtx(c ?? p.context, origin(p)), { query: str(p.query) });
