import type { CheckResult, Coverage, Verdict } from "./contract.js";

/**
 * Overall verdict for a target (spec 0004, §10.3 rule 2 plus finding 7):
 * conflict if any result is a conflict; otherwise inconclusive if any result is inconclusive or any applicable
 * decision went unchecked; otherwise ok. A clear "ok" is only possible with full coverage.
 */
export function overallVerdict(results: CheckResult[], coverage: Coverage): Verdict {
  if (results.some((r) => r.verdict === "conflict")) return "conflict";
  if (results.some((r) => r.verdict === "inconclusive")) return "inconclusive";
  if (coverage.unchecked.length > 0 || coverage.checked < coverage.applicable) return "inconclusive";
  return "ok";
}
