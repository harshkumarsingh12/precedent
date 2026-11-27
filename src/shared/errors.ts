import type { Owner } from "./team.js";

/** A stub that names who to ask and which spec describes the missing behaviour. */
export class NotImplementedError extends Error {
  constructor(
    readonly what: string,
    readonly owner: Owner,
    readonly spec: string,
  ) {
    super(`Not implemented: ${what} (owner @${owner}, ${spec})`);
    this.name = "NotImplementedError";
  }
}
