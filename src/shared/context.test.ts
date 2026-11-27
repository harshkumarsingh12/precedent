import { expect, test } from "vitest";
import { toCtx } from "./context";

test("the acting user comes from the invocation context", () => {
  const ctx = toCtx({ principal: { accountId: "557058:abc" } }, "mcp", 1_700_000_000_000);
  expect(ctx).toEqual({ accountId: "557058:abc", origin: "mcp", asUser: true, now: 1_700_000_000 });
});

test("no principal means no user: background runs act as the app", () => {
  expect(toCtx(undefined, "trigger").asUser).toBe(false);
});
