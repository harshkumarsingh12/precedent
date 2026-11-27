import { expect } from "vitest";
import { ledger } from "./ledger";
import { core } from "../src/core/index";
import { validateTransition } from "../src/guard/validator";
import { owner } from "./fixtures";

// Spec 0005: workflow validator and conflict resolution.

ledger(
  "M3",
  "srshriv",
  "an open conflict blocks the guarded transition with a viewer-safe message",
  async () => {
    const out = await validateTransition({ issue: { key: "NWP-2" } });
    expect(out.result).toBe(false);
    expect(out.errorMessage).toMatch(/Precedent/);
  },
);

ledger("M3", "srshriv", "finding 4: Follow alone does not unblock the transition", async () => {
  await core.resolveCheck(owner, { targetRef: "NWP-2", decisionId: "DEC-2", action: "follow" });
  const out = await validateTransition({ issue: { key: "NWP-2" } });
  expect(out.result).toBe(false);
});

ledger("M3", "srshriv", "a dismissal needs a note", async () => {
  await expect(
    core.resolveCheck(owner, { targetRef: "NWP-2", decisionId: "DEC-2", action: "dismiss" }),
  ).rejects.toMatchObject({ code: "note_required" });
});
