import { describe, expect, test } from "vitest";
import type { CheckResult, Coverage } from "./contract.js";
import { overallVerdict } from "./verdict.js";

const ok = (id: string): CheckResult => ({ decisionId: id, verdict: "ok", method: "rule" });
const full = (n: number): Coverage => ({ applicable: n, checked: n, unchecked: [] });

describe("overallVerdict", () => {
  test("ok only when every applicable decision was checked and passed", () => {
    expect(overallVerdict([ok("DEC-1"), ok("DEC-2")], full(2))).toBe("ok");
  });

  test("any conflict wins, even with gaps in coverage", () => {
    const results = [ok("DEC-1"), { ...ok("DEC-2"), verdict: "conflict" as const }];
    expect(overallVerdict(results, { applicable: 3, checked: 2, unchecked: ["DEC-3"] })).toBe("conflict");
  });

  test("an inconclusive result is never reported as ok", () => {
    const results = [ok("DEC-1"), { ...ok("DEC-2"), verdict: "inconclusive" as const }];
    expect(overallVerdict(results, full(2))).toBe("inconclusive");
  });

  test("finding 7: an unchecked applicable decision makes the verdict inconclusive", () => {
    const results = Array.from({ length: 10 }, (_, i) => ok(`DEC-${i + 1}`));
    expect(overallVerdict(results, { applicable: 11, checked: 10, unchecked: ["DEC-11"] })).toBe(
      "inconclusive",
    );
  });
});
