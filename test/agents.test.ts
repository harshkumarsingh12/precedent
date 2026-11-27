import { expect } from "vitest";
import { ledger } from "./ledger";
import { core } from "../src/core/index";
import { agent } from "./fixtures";

// Spec 0006: Rovo agent, actions, MCP tools and the agent rules export.

ledger("M3", "harshkumarsingh12", "get_decisions over MCP returns accepted decisions in scope", async () => {
  const out = await core.getDecisions(agent, { scope: "repo:loyalty-service" });
  expect(out.decisions.every((d) => d.status === "accepted")).toBe(true);
  expect(out.decisions.length).toBeGreaterThan(0);
});

ledger(
  "M3",
  "hoursgotviral-dev",
  "export_agent_rules renders a block between the precedent markers",
  async () => {
    const out = await core.exportAgentRules(agent, { scope: "repo:loyalty-service", format: "agents_md" });
    expect(out.markdown).toMatch(/^<!-- precedent:start -->[\s\S]*<!-- precedent:end -->$/m);
  },
);

ledger("M3", "harshkumarsingh12", "finding 9: agent diff checks are labelled advisory", async () => {
  const out = await core.checkProposal(agent, {
    scope: "repo:checkout-service",
    diff: "+import Stripe from 'stripe'",
  });
  expect(out.advisory).toBe(true);
});
