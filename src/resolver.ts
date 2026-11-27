import Resolver from "@forge/resolver";
import { core } from "./core/index";
import { toCtx } from "./shared/context";

/** Backend for the UI Kit screens (panel, badge, ledger, setup). Every call goes through core. */
const resolver = new Resolver();

resolver.define("getIssueState", ({ payload, context }) =>
  core.getIssueState(toCtx(context, "panel"), { issueKey: String(payload.issueKey) }),
);

resolver.define("getDecisions", ({ payload, context }) =>
  core.getDecisions(toCtx(context, "panel"), { scope: String(payload.scope) }),
);

export const handler = resolver.getDefinitions();
