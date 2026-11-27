#!/usr/bin/env node
// Offline manifest checks that run in CI without Forge credentials. `forge lint` stays the authority.
//  - every function handler `index.X` is exported from src/index.ts
//  - every resource path exists
//  - every action referenced by rovo:agent / rovo:mcp is declared, and every action's function exists
import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";

const manifest = parse(readFileSync("manifest.yml", "utf8"));
const index = readFileSync("src/index.ts", "utf8");
const errors = [];
const m = manifest.modules ?? {};

const functions = new Map((m.function ?? []).map((f) => [f.key, f.handler]));
for (const [key, handler] of functions) {
  const name = handler.replace(/^index\./, "");
  if (!new RegExp(`\\b${name}\\b`).test(index))
    errors.push(`function ${key}: ${name} is not exported from src/index.ts`);
}

for (const r of manifest.resources ?? [])
  if (!existsSync(r.path)) errors.push(`resource ${r.key}: ${r.path} missing`);

const actions = new Set((m.action ?? []).map((a) => a.key));
for (const a of m.action ?? [])
  if (!functions.has(a.function)) errors.push(`action ${a.key}: unknown function ${a.function}`);
for (const agent of m["rovo:agent"] ?? [])
  for (const a of agent.actions ?? [])
    if (!actions.has(a)) errors.push(`rovo:agent ${agent.key}: unknown action ${a}`);
for (const mcp of m["rovo:mcp"] ?? []) {
  if ((mcp.tools ?? []).length > 50) errors.push(`rovo:mcp ${mcp.key}: more than 50 tools`);
  for (const t of mcp.tools ?? []) if (!actions.has(t)) errors.push(`rovo:mcp ${mcp.key}: unknown tool ${t}`);
}

const fnRefs = [
  ...Object.values(m)
    .flat()
    .filter((x) => x && typeof x === "object" && "function" in x && typeof x.function === "string")
    .map((x) => x.function),
  ...Object.values(m)
    .flat()
    .filter((x) => x?.resolver?.function)
    .map((x) => x.resolver.function),
];
for (const f of fnRefs) if (!functions.has(f)) errors.push(`module references unknown function ${f}`);

if (errors.length) {
  console.error("manifest.yml problems:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(
  `manifest.yml OK: ${functions.size} functions, ${actions.size} actions, ${(manifest.resources ?? []).length} resources`,
);
