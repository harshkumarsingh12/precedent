import type { Ctx, Origin } from "../core/contract";

/** The shape Forge passes as the second argument to functions. Only the parts we read. */
export interface ForgeInvocationContext {
  principal?: { accountId?: string };
  accountId?: string;
}

/**
 * Builds the core context. The acting user comes from Forge's invocation context only, never from an input a
 * model extracted (spec 0007).
 */
export function toCtx(context: ForgeInvocationContext | undefined, origin: Origin, now = Date.now()): Ctx {
  const accountId = context?.principal?.accountId ?? context?.accountId ?? null;
  return { accountId, origin, asUser: accountId !== null, now: Math.floor(now / 1000) };
}
