import { expect } from "vitest";
import { ledger } from "./ledger.js";
import { core } from "../src/core/index.js";
import { restricted } from "./fixtures.js";

// Spec 0007: a decision is never more visible than its source.

ledger("M3", "srshriv", "a restricted user gets no decision text, only a hidden count", async () => {
  const out = await core.getDecisions(restricted, { scope: "project:NWP" });
  expect(out.decisions.map((d) => d.id)).not.toContain("DEC-5");
  expect(out.hiddenCount).toBeGreaterThan(0);
});

ledger(
  "M3",
  "srshriv",
  "finding 3: an unapproved restricted rule stays out of the repository export",
  async () => {
    const out = await core.exportAgentRules(restricted, {
      scope: "repo:loyalty-service",
      format: "agents_md",
    });
    expect(out.decisionIds).not.toContain("DEC-5");
  },
);
