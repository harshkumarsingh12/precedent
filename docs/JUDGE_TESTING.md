# Judge testing instructions

> Draft. Finalised after the fresh-install test on 17 Dec (owner: Sikruti; test run: Sristee). Every point where
> the tester hesitates becomes a line here or a fix.

## Install (2 minutes)

1. Open the installation link (added at submission) and choose your Jira site. Approve the scopes and the Forge
   LLM notice.
2. In Jira: Apps → Manage apps → **Precedent setup**. Every health check should be green; each red check says
   what to do.

## See it work (10 minutes)

1. On the setup page, click **Load sample workspace**. It creates the project _Northwind Payments_ (NWP).
2. Open the work items listed in the three-step guide. Confirm the four proposed decisions.
3. Open **Loyalty points service**: a conflict card quotes DEC-4 beside "points expire after 12 months".
4. Open **Add refund endpoint at /api/refunds**: a rule conflict with DEC-2, with the matched evidence.
5. Add the validator: follow the setup page guide for _To Do → Ready for agent_. Try the transition: it is
   blocked. Fix the path to `/v2/refunds`, wait for the check, try again: it succeeds.
6. Open Rovo chat → **Precedent** → "Why do we route payments through the gateway?"
7. In Rovo Studio, create an agent, add the **Precedent** tools, and ask it for the decisions in scope `NWP`.

## Optional

- External MCP client: enable the app under Apps → Sites → your site → Connected apps, then connect to
  `https://mcp.atlassian.com/forge/<appId>`.

## Limits

The validator needs admin setup; agent diff checks are advisory; external MCP needs admin enablement.
