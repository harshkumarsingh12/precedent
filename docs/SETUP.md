# Setup

## Tools

| Tool      | Version                  | Why                                                |
| --------- | ------------------------ | -------------------------------------------------- |
| Node.js   | 22 (`.nvmrc`)            | Forge runtime and CLI (the CLI supports 22 and 24) |
| Bun       | 1.4.x (`packageManager`) | Package manager and script runner                  |
| Forge CLI | latest                   | `npm install -g @forge/cli`                        |

```bash
bun install
bun run test && bun run manifest:check
```

`bunfig.toml` sets the hoisted linker, so `node_modules` is a flat tree the Forge bundler reads without
surprises.

## Forge, once per person

1. Create an Atlassian API token: <https://id.atlassian.com/manage/api-tokens>.
2. `forge login` (use the token).
3. `forge site provision` to get a **demo site with Rovo**. Free developer sites can lack Rovo Chat; judges use
   demo sites. Confirm Rovo Chat opens.

## Forge, once for the team (Harsh)

1. `forge register` in the repo root. It writes the real app id into `manifest.yml`; commit that in a PR
   (`chore: register the forge app`). The deploy workflow skips while the placeholder id is present.
2. Add repository secrets `FORGE_EMAIL` and `FORGE_API_TOKEN` (the app owner's). From then on every merge to
   `main` deploys to the **development** environment; a `v*` tag deploys **production**.
3. Install on the shared development site: `forge install --site <site>.atlassian.net --product jira`.
4. Each teammate who should deploy is added as an app contributor in the developer console.

## Daily loop

```bash
forge tunnel            # live-reload functions against your site
forge logs -e development
forge deploy -e development && forge install --upgrade
```

## The workflow validator

The validator is added by a Jira admin: Project settings → Workflows → edit → choose the transition (for example
_To Do → Ready for agent_) → Validators → **No unresolved decision conflicts**. The setup page shows the same
steps.

## External MCP clients (optional, stretch S4)

An org or site admin enables the app's tools under Apps → Sites → _site_ → Connected apps. Clients connect to
`https://mcp.atlassian.com/forge/<appId>` with OAuth 2.1.

## Production and the install link (M4)

```bash
forge deploy -e production
```

Then Developer console → the app → Distribution → create the share link. **Never submit to the Marketplace**:
an app submitted for listing can no longer be shared by link.
