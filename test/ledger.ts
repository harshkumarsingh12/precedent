import { test } from "vitest";
import type { Milestone, Owner } from "../src/shared/team";

/**
 * An acceptance criterion that is not built yet.
 *
 * The body must assert the finished behaviour. It runs as `test.fails`, so today it passes because the assertion
 * fails. The day the feature works, the assertion passes, the test goes red, and the owner replaces ledger() with a
 * plain test() in the same PR. Nobody can claim "done" without the test agreeing.
 *
 * The title format `[M2 @owner] ...` is what scripts/ledger.mjs counts for the burndown.
 */
export function ledger(milestone: Milestone, owner: Owner, title: string, fn: () => unknown): void {
  test.fails(`[${milestone} @${owner}] ${title}`, fn as () => Promise<void>);
}
