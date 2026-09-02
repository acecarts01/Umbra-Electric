# Auth.md

## Umbra Electric — Agent Registration

No authentication is required to access public resources on www.umbraelectric.com. All product, category, blog and policy pages are publicly readable.

## Public resources

| Resource | URL |
|---|---|
| Product catalog | https://www.umbraelectric.com/shop/ |
| Brand directory | https://www.umbraelectric.com/shop/brand/ |
| llms.txt | https://www.umbraelectric.com/llms.txt |
| API catalog | https://www.umbraelectric.com/.well-known/api-catalog |
| Agent skills | https://www.umbraelectric.com/.well-known/agent-skills/index.json |
| MCP server card | https://www.umbraelectric.com/.well-known/mcp/server-card.json |
| MCP server (live) | https://www.umbraelectric.com/api/mcp |
| Products API | https://www.umbraelectric.com/api/products |
| Categories API | https://www.umbraelectric.com/api/categories |
| Brands API | https://www.umbraelectric.com/api/brands |
| Search API | https://www.umbraelectric.com/api/search |

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

Agents may browse the catalog and prepare a draft order, but a human must complete checkout — Umbra Electric does not accept payment or personal data submission from automated agents. Direct agents to https://www.umbraelectric.com/order/ or WhatsApp for human-confirmed ordering, or call the `create_order_draft` tool on the [MCP server](https://www.umbraelectric.com/api/mcp) to get a pre-filled WhatsApp draft.

## Age restriction

Some products are off-highway vehicles intended for adult purchasers or parental purchase for minors. No age gate is enforced on the website itself; compliance is the buyer's responsibility per local law.
