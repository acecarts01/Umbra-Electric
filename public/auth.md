# Auth.md

## Umbra Electric — Agent Registration

No authentication is required to access public resources on umbraelectric.com. All product, category, blog and policy pages are publicly readable.

## Public resources

| Resource | URL |
|---|---|
| Product catalog | https://umbraelectric.com/shop/ |
| llms.txt | https://umbraelectric.com/llms.txt |
| API catalog | https://umbraelectric.com/.well-known/api-catalog |
| Agent skills | https://umbraelectric.com/.well-known/agent-skills/index.json |
| MCP server card | https://umbraelectric.com/.well-known/mcp/server-card.json |

```json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required. All resources are public."
  }
}
```

## Ordering

Agents may browse the catalog and prepare a draft order, but a human must complete checkout — Umbra Electric does not accept payment or personal data submission from automated agents. Direct agents to https://umbraelectric.com/order/ or WhatsApp for human-confirmed ordering.

## Age restriction

Some products are off-highway vehicles intended for adult purchasers or parental purchase for minors. No age gate is enforced on the website itself; compliance is the buyer's responsibility per local law.
