import { expect } from "vitest";
import { ledger } from "./ledger";
import { seedSampleWorkspace } from "../src/seed/index";

// Spec 0010: sample workspace.

ledger(
  "M3",
  "hoursgotviral-dev",
  "the sample workspace seeds NWP with four proposed decisions, and a rerun duplicates nothing",
  async () => {
    const first = await seedSampleWorkspace();
    const second = await seedSampleWorkspace();
    expect(first).toMatchObject({ projectKey: "NWP", created: true, proposedDecisions: 4 });
    expect(second.created).toBe(false);
  },
);
