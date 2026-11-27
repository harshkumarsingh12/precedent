import type { CoreService } from "./contract";
import { NotImplementedError } from "../shared/errors";

/**
 * The only code that reads or writes decisions and checks. Every surface calls these functions; none reads
 * storage directly. Each stub names its owner and spec until it is built.
 */
export const core: CoreService = {
  async getDecisions() {
    throw new NotImplementedError("getDecisions", "harshkumarsingh12", "docs/specs/0002-core-service.md");
  },
  async checkProposal() {
    throw new NotImplementedError(
      "checkProposal",
      "harshkumarsingh12",
      "docs/specs/0004-guard-and-rule-checks.md",
    );
  },
  async recordDecision() {
    throw new NotImplementedError(
      "recordDecision",
      "harshkumarsingh12",
      "docs/specs/0001-decision-lifecycle.md",
    );
  },
  async confirmDecision() {
    throw new NotImplementedError(
      "confirmDecision",
      "harshkumarsingh12",
      "docs/specs/0001-decision-lifecycle.md",
    );
  },
  async supersedeDecision() {
    throw new NotImplementedError(
      "supersedeDecision",
      "harshkumarsingh12",
      "docs/specs/0001-decision-lifecycle.md",
    );
  },
  async resolveCheck() {
    throw new NotImplementedError("resolveCheck", "harshkumarsingh12", "docs/specs/0005-enforcement.md");
  },
  async explainDecision() {
    throw new NotImplementedError(
      "explainDecision",
      "harshkumarsingh12",
      "docs/specs/0006-agents-and-mcp.md",
    );
  },
  async exportAgentRules() {
    throw new NotImplementedError(
      "exportAgentRules",
      "hoursgotviral-dev",
      "docs/specs/0006-agents-and-mcp.md",
    );
  },
  async getIssueState() {
    throw new NotImplementedError("getIssueState", "harshkumarsingh12", "docs/specs/0002-core-service.md");
  },
};
