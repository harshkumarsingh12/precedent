import { NotImplementedError } from "./shared/errors";

/** avi:jira:created:issue and avi:jira:updated:issue: queue a guard job when anything the verdict depends on changed. */
export async function onIssueEvent(_event: unknown): Promise<void> {
  throw new NotImplementedError(
    "issue trigger → guard queue",
    "harshkumarsingh12",
    "docs/specs/0004-guard-and-rule-checks.md",
  );
}

/** avi:jira:commented:issue: pre-filter, then queue a capture job. */
export async function onCommentEvent(_event: unknown): Promise<void> {
  throw new NotImplementedError(
    "comment trigger → capture queue",
    "harshkumarsingh12",
    "docs/specs/0003-capture.md",
  );
}

export async function guardConsumer(_event: unknown): Promise<void> {
  throw new NotImplementedError(
    "guard consumer",
    "harshkumarsingh12",
    "docs/specs/0004-guard-and-rule-checks.md",
  );
}

export async function captureConsumer(_event: unknown): Promise<void> {
  throw new NotImplementedError("capture consumer", "sumedhag28", "docs/specs/0003-capture.md");
}
