/**
 * Evaluation runner (spec 0009). Prints precision, recall and the counts of false blocks, missed conflicts and
 * inconclusive results for one fixture set, and writes docs/evals/<date>-<set>.{md,json}.
 *
 *   bun run eval -- --set tuning
 *   bun run eval -- --set holdout     # published numbers; frozen thresholds only
 *
 * Owner: @sumedhag28. Until the checkers and the judge exist this only counts the fixtures.
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";

const set = process.argv.includes("--set") ? process.argv[process.argv.indexOf("--set") + 1] : "tuning";
if (set !== "tuning" && set !== "holdout") throw new Error(`--set must be tuning or holdout, got ${set}`);

const dir = join(import.meta.dirname, "fixtures", set);
const cases = readdirSync(dir).filter((f) => f.endsWith(".json"));
console.log(
  `${set}: ${cases.length} cases (target: tuning 72, holdout 46). Scoring lands with the rule checkers.`,
);
