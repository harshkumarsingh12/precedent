import type { Ctx } from "../src/core/contract";

export const NOW = 1_796_000_000;
export const owner: Ctx = { accountId: "acc-owner", origin: "panel", asUser: true, now: NOW };
export const reader: Ctx = { accountId: "acc-reader", origin: "panel", asUser: true, now: NOW };
export const restricted: Ctx = { accountId: "acc-restricted", origin: "panel", asUser: true, now: NOW };
export const agent: Ctx = { accountId: "acc-owner", origin: "mcp", asUser: true, now: NOW };
