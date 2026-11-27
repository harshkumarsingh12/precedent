import { expect } from "vitest";
import { ledger } from "./ledger";
import { core } from "../src/core/index";
import { owner, reader } from "./fixtures";

// Spec 0001: decision model, lifecycle and approval authority.

ledger(
  "M2",
  "harshkumarsingh12",
  "recordDecision always creates a proposed decision, never an accepted one",
  async () => {
    const { decision } = await core.recordDecision(owner, {
      statement: "All public API routes are versioned under /v2.",
      scope: "project:NWP",
      source: { type: "manual", issueKey: "NWP-1" },
    });
    expect(decision.status).toBe("proposed");
  },
);

ledger(
  "M2",
  "harshkumarsingh12",
  "finding 2: a source reader can propose but cannot confirm a site-wide rule",
  async () => {
    await expect(core.confirmDecision(reader, { id: "DEC-1" })).rejects.toMatchObject({
      code: "not_an_approver",
    });
  },
);

ledger(
  "M2",
  "harshkumarsingh12",
  "superseding requires a reason and links old and new both ways",
  async () => {
    const { oldDecision, newDecision } = await core.supersedeDecision(owner, {
      id: "DEC-4",
      newStatement: "Loyalty points expire after 24 months of inactivity.",
      reason: "Finance needs a liability cap.",
      scopeKeys: ["component:NWP/loyalty"],
    });
    expect(oldDecision.supersededBy).toBe(newDecision.id);
    expect(newDecision.supersedes).toBe(oldDecision.id);
  },
);

ledger(
  "M2",
  "harshkumarsingh12",
  "finding 5: a narrower scope cannot supersede a broader decision",
  async () => {
    await expect(
      core.supersedeDecision(owner, {
        id: "DEC-4",
        newStatement: "Promotional points expire after 90 days.",
        reason: "Promotions only.",
        scopeKeys: ["component:NWP/promotions"],
      }),
    ).rejects.toMatchObject({ code: "scope_mismatch" });
  },
);
