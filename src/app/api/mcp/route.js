import { NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { EXECUTORS } from '@/lib/mcpExecutors';
import MCP_TOOLS from '@/data/mcp-tools.json';

// MCP server, Streamable HTTP transport (spec 2025-03-26). One endpoint,
// POST-only JSON-RPC 2.0 (WebForge Agent-Ready V1) -- a product catalog
// answers every call fast enough that an SSE upgrade adds nothing, so no
// GET/SSE stream is implemented, matching the skill's own guidance.
// Read-only plus order-DRAFT only -- never captures payment or personal
// data. Tool list comes from src/data/mcp-tools.json, the same file
// scripts/gen-agent-files.mjs reads to build server-card.json's tools[]
// array, so the two can never drift apart.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id',
};

function rpcResult(id, result) {
  return NextResponse.json({ jsonrpc: '2.0', id: id ?? null, result }, { headers: CORS_HEADERS });
}

function rpcError(id, code, message, status = 200) {
  // JSON-RPC protocol errors (unknown method, bad params) are still
  // delivered as HTTP 200 with the error in the payload, per spec -- only a
  // genuinely malformed HTTP body gets a non-200 status.
  return NextResponse.json({ jsonrpc: '2.0', id: id ?? null, error: { code, message } }, { headers: CORS_HEADERS, status });
}

function toolContent(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

function toolError(message) {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      name: SITE.name,
      protocol: 'mcp',
      transport: 'streamable-http',
      note: 'POST JSON-RPC 2.0 requests here with Accept: application/json. Methods: initialize, tools/list, tools/call.',
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return rpcError(null, -32700, 'Parse error: invalid JSON', 400);
  }

  const { id = null, method, params } = body || {};

  if (method === 'initialize') {
    return rpcResult(id, {
      protocolVersion: '2025-03-26',
      serverInfo: { name: SITE.name, version: '1.0.0' },
      capabilities: { tools: {} },
    });
  }

  if (method === 'tools/list') {
    return rpcResult(id, { tools: MCP_TOOLS });
  }

  if (method === 'tools/call') {
    const name = params?.name;
    const args = params?.arguments || {};
    const executor = EXECUTORS[name];
    if (!executor) return rpcResult(id, toolError(`Unknown tool: ${name}`));
    try {
      const data = executor(args);
      if (data && typeof data === 'object' && data.error) return rpcResult(id, toolError(data.error));
      return rpcResult(id, toolContent(data));
    } catch (e) {
      return rpcResult(id, toolError(`Tool execution failed: ${e.message}`));
    }
  }

  return rpcError(id, -32601, `Unknown method: ${method}`);
}
