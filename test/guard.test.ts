import { expect } from "vitest";
import { ledger } from "./ledger";
import { core } from "../src/core/index";
import { owner } from "./fixtures";

// Spec 0004: guard, rule checkers, freshness and coverage.

ledger(
  "M2",
  "sumedhag28",
  "api_convention: /api/refunds conflicts with the /v2 rule, with the matched evidence",
  async () => {
    const out = await core.checkProposal(owner, {
      scope: "project:NWP",
      text: "Add refund endpoint at /api/refunds",
    });
    expect(out.verdict).toBe("conflict");
    expect(out.results[0]?.evidence).toContain("/api/refunds");
  },
);

ledger("M2", "sumedhag28", "finding 6: 'remove the Stripe SDK' does not block; adding it does", async () => {
  const remove = await core.checkProposal(owner, {
    scope: "component:NWP/checkout",
    diff: '-  "stripe": "^14.0.0"',
  });
  const add = await core.checkProposal(owner, {
    scope: "component:NWP/checkout",
    diff: '+  "stripe": "^14.0.0"',
  });
  expect(remove.verdict).not.toBe("conflict");
  expect(add.verdict).toBe("conflict");
});

ledger(
  "M2",
  "harshkumarsingh12",
  "finding 1: accepting a conflicting rule makes an unchanged work item's ok verdict stale",
  async () => {
    const state = await core.getIssueState(owner, { issueKey: "NWP-7" });
    expect(state.stale).toBe(true);
  },
);

ledger(
  "M3",
  "sumedhag28",
  "finding 7: eleven free-text decisions with a violation in the eleventh never yield ok",
  async () => {
    const out = await core.checkProposal(owner, {
      scope: "project:EVAL11",
      text: "Ship the eleventh-rule violation.",
    });
    expect(out.verdict).not.toBe("ok");
  },
);

ledger("M2", "sumedhag28", "a model failure yields inconclusive, never ok", async () => {
  const out = await core.checkProposal(owner, { scope: "component:NWP/loyalty", text: "MODEL_DOWN fixture" });
  expect(out.verdict).toBe("inconclusive");
});
