import { NotImplementedError } from "../shared/errors";

/**
 * Rule-based pre-filter that runs before any model call (spec 0003): keep a comment only if it reads like a
 * decision ("we decided", "agreed to", "from now on", "must not", ...). Most comments stop here at zero cost.
 */
export function isDecisionCandidate(_comment: string): boolean {
  throw new NotImplementedError("capture pre-filter", "sumedhag28", "docs/specs/0003-capture.md");
}
