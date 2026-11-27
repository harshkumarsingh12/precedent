import { NotImplementedError } from "../shared/errors";

export interface SeedResult {
  projectKey: string;
  created: boolean;
  proposedDecisions: number;
}

/** One-click Northwind Payments sample workspace (spec 0010). Idempotent: a second run detects the project. */
export async function seedSampleWorkspace(): Promise<SeedResult> {
  throw new NotImplementedError(
    "sample workspace",
    "hoursgotviral-dev",
    "docs/specs/0010-sample-workspace-and-demo.md",
  );
}
