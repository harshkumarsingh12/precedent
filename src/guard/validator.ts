import { NotImplementedError } from "../shared/errors.js";

export interface ValidatorInput {
  issue: { key: string };
  transition?: { from?: { id: string }; to?: { id: string } };
}

export interface ValidatorResult {
  result: boolean;
  errorMessage?: string;
}

/** jira:workflowValidator precedent-no-open-conflicts. No model call; viewer-safe message (spec 0005). */
export async function validateTransition(_input: ValidatorInput): Promise<ValidatorResult> {
  throw new NotImplementedError("workflow validator", "srshriv", "docs/specs/0005-enforcement.md");
}
