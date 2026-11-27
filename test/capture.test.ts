import { expect } from "vitest";
import { ledger } from "./ledger.js";
import { isDecisionCandidate } from "../src/capture/prefilter.js";

// Spec 0003: capture.

ledger("M2", "sumedhag28", "the pre-filter keeps decision language and drops ordinary comments", () => {
  expect(isDecisionCandidate("We decided that public APIs live under /v2.")).toBe(true);
  expect(isDecisionCandidate("Should we decide on the API prefix next sprint?")).toBe(false);
  expect(isDecisionCandidate("LGTM, merging.")).toBe(false);
});
