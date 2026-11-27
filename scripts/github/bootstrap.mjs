#!/usr/bin/env node
// Creates labels, milestones and the issue backlog on GitHub. Safe to rerun: existing items are skipped.
//
//   node scripts/github/bootstrap.mjs            # labels, milestones, issues (unassigned; Harsh assigns)
//   node scripts/github/bootstrap.mjs --assign   # assign each issue to its suggested owner (after invites are accepted)
//
// Needs the GitHub CLI, authenticated with access to the repo.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const REPO = process.env.REPO ?? "harshkumarsingh12/precedent";
const backlog = JSON.parse(readFileSync(new URL("./backlog.json", import.meta.url), "utf8"));

const gh = (args, input) =>
  execFileSync("gh", args, { encoding: "utf8", input, stdio: ["pipe", "pipe", "inherit"] }).trim();
const api = (path, ...args) => JSON.parse(gh(["api", path, ...args]) || "null");
const apiPages = (path) => JSON.parse(gh(["api", "--paginate", "--slurp", path])).flat();

const MILESTONES = {
  M0: [
    "M0 Foundations",
    "2026-11-29",
    "Repo and CI live, specs 0001–0010 Accepted, Forge app registered, every teammate has a demo site with Rovo, hello-world panel on the shared site.",
  ],
  M1: [
    "M1 Spike go/no-go",
    "2026-12-02",
    "Every must-pass spike test passes on a second site as a non-contributor, or the team switches to CAPA Replay on 3 Dec.",
  ],
  M2: [
    "M2 Core loop",
    "2026-12-09",
    "Record, capture, confirm, typed rules, guard with freshness, conflict card, ledger. The seeded refund work item shows a rule conflict with both quotes and evidence.",
  ],
  M3: [
    "M3 Feature freeze",
    "2026-12-14",
    "Validator, Rovo agent, MCP tools, rules export, permissions everywhere, sample workspace, 100+ eval cases with a holdout. A Rovo Studio agent calls get_decisions on a fresh install.",
  ],
  M4: [
    "M4 Fresh install",
    "2026-12-17",
    "Every UI state, negative cases, final evaluation on frozen thresholds; the fresh-install test passes as a non-contributor.",
  ],
  M5: [
    "M5 Submission",
    "2026-12-20",
    "Video public, Devpost submitted, README with measured numbers, release tagged.",
  ],
};

const LABELS = [
  ["area:core", "1f6feb", "Core service, storage, guard pipeline, triggers"],
  ["area:ui", "0e8a16", "Issue panel, conflict card, badge, ledger, setup page"],
  ["area:rules", "8250df", "Deterministic rule checkers"],
  ["area:ai", "d4a72c", "Capture, prompts, model judge"],
  ["area:agents", "bf3989", "Rovo agent, actions, rovo:mcp, rules export, SKILL.md"],
  ["area:permissions", "b60205", "Source permissions, security, cost controls"],
  ["area:validator", "5319e7", "Jira workflow validator and resolution"],
  ["area:eval", "fbca04", "Evaluation fixtures and reports"],
  ["area:demo", "fb8f44", "Sample workspace, video, Devpost, judge docs"],
  ["area:infra", "57606a", "Repo, CI/CD, Forge deploys"],
  ["type:feat", "a2eeef", "New capability"],
  ["type:bug", "d73a4a", "Behaves differently from the spec"],
  ["type:spec", "c5def5", "Spec to write or accept"],
  ["type:chore", "ededed", "Setup, ops, process, spikes"],
  ["type:docs", "0075ca", "Documentation"],
  ["P0", "b60205", "Blocks a milestone"],
  ["P1", "fbca04", "Needed for the demo"],
  ["P2", "c2e0c6", "Nice to have"],
  ["blocked", "000000", "Waiting on something outside the owner's control"],
  ["stretch", "f9d0c4", "Only after the feature-freeze exit checks"],
  ["review-finding", "e99695", "Implements one of the nine review findings (docs/PROJECT.md §6)"],
];

function ensureLabels() {
  const have = new Set(apiPages(`repos/${REPO}/labels?per_page=100`).map((l) => l.name));
  for (const [name, color, description] of LABELS) {
    if (have.has(name)) continue;
    api(
      `repos/${REPO}/labels`,
      "-f",
      `name=${name}`,
      "-f",
      `color=${color}`,
      "-f",
      `description=${description}`,
    );
    console.log(`label   + ${name}`);
  }
}

function ensureMilestones() {
  const byTitle = new Map(
    apiPages(`repos/${REPO}/milestones?state=all&per_page=100`).map((m) => [m.title, m.number]),
  );
  const numbers = {};
  for (const [key, [title, due, description]] of Object.entries(MILESTONES)) {
    if (!byTitle.has(title)) {
      const m = api(
        `repos/${REPO}/milestones`,
        "-f",
        `title=${title}`,
        "-f",
        `due_on=${due}T23:59:59Z`,
        "-f",
        `description=${description}`,
      );
      byTitle.set(title, m.number);
      console.log(`mstone  + ${title}`);
    }
    numbers[key] = byTitle.get(title);
  }
  return numbers;
}

function body(item) {
  const spec =
    item.spec.startsWith("docs/") || item.spec.endsWith(".md")
      ? `[\`${item.spec}\`](https://github.com/${REPO}/blob/main/${item.spec})`
      : item.spec;
  return [
    `**Suggested owner:** @${item.owner} · **Milestone:** ${MILESTONES[item.milestone][0]} (due ${MILESTONES[item.milestone][1]}) · **Spec:** ${spec}`,
    "",
    "## What",
    item.what,
    "",
    "## Done when",
    item.done,
  ].join("\n");
}

function ensureIssues(milestones) {
  const existing = new Map(
    apiPages(`repos/${REPO}/issues?state=all&per_page=100`)
      .filter((i) => !i.pull_request)
      .map((i) => [i.title, i]),
  );
  for (const item of backlog) {
    if (existing.has(item.title)) continue;
    const payload = JSON.stringify({
      title: item.title,
      body: body(item),
      milestone: milestones[item.milestone],
      labels: [
        `area:${item.area}`,
        `type:${item.type}`,
        item.priority,
        ...(/finding \d/i.test(item.what + item.done) ? ["review-finding"] : []),
      ],
    });
    const issue = JSON.parse(gh(["api", `repos/${REPO}/issues`, "--input", "-"], payload));
    console.log(`issue   + #${issue.number} ${item.title}`);
  }
}

function assignOwners() {
  const collaborators = new Set(
    apiPages(`repos/${REPO}/collaborators?per_page=100`).map((c) => c.login.toLowerCase()),
  );
  const issues = new Map(
    apiPages(`repos/${REPO}/issues?state=open&per_page=100`)
      .filter((i) => !i.pull_request)
      .map((i) => [i.title, i]),
  );
  for (const item of backlog) {
    const issue = issues.get(item.title);
    if (!issue || issue.assignees.length) continue;
    if (!collaborators.has(item.owner.toLowerCase())) {
      console.log(`assign  ~ #${issue.number} waiting for @${item.owner} to accept the invite`);
      continue;
    }
    api(`repos/${REPO}/issues/${issue.number}/assignees`, "-f", `assignees[]=${item.owner}`);
    console.log(`assign  + #${issue.number} @${item.owner}`);
  }
}

if (process.argv.includes("--assign")) {
  assignOwners();
} else {
  ensureLabels();
  ensureIssues(ensureMilestones());
}
