// Postgres mirror for the admin portal to list against. NOT the source of
// truth for an order's contents (the signed token is) -- but IS the live
// source of truth for status once an order exists here. A write failure
// must never block a confirmation email from sending; callers wrap writes
// in try/catch and swallow, never let a DB hiccup break the customer flow.
import { neon } from '@neondatabase/serverless';

function connectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED || '';
}

let sqlClient = null;
function sql() {
  if (!sqlClient) {
    const cs = connectionString();
    if (!cs) throw new Error('No Postgres connection string set (DATABASE_URL / POSTGRES_URL).');
    sqlClient = neon(cs);
  }
  return sqlClient;
}

// Cold-start-safe migration cache: a serverless Postgres instance (Neon)
// suspends after idle and can be cold on first request. If that first
// connection throws and this promise were naively memoized, it would stay
// REJECTED FOREVER for the life of the function instance -- clearing the
// cache in .catch lets the next call retry instead of failing forever.
let migrated = null;
export function migrate() {
  if (!migrated) {
    migrated = (async () => {
      const db = sql();
      await db`
        CREATE TABLE IF NOT EXISTS orders (
          ref TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL,
          status TEXT NOT NULL,
          channel TEXT NOT NULL,
          payment TEXT NOT NULL,
          customer JSONB NOT NULL,
          lines JSONB NOT NULL,
          totals JSONB NOT NULL,
          invoice JSONB,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await db`
        CREATE TABLE IF NOT EXISTS order_events (
          id SERIAL PRIMARY KEY,
          order_ref TEXT NOT NULL REFERENCES orders(ref) ON DELETE CASCADE,
          status TEXT NOT NULL,
          note TEXT,
          at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await db`
        CREATE TABLE IF NOT EXISTS enquiries (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          form_type TEXT NOT NULL,
          name TEXT NOT NULL,
          email TEXT, phone TEXT, message TEXT,
          payload JSONB NOT NULL
        )
      `;
    })().catch((e) => {
      migrated = null; // let the next call retry instead of staying rejected forever
      throw e;
    });
  }
  return migrated;
}

export async function withRetry(fn) {
  try {
    return await fn();
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return fn();
  }
}

export async function upsertOrder(order) {
  await migrate();
  const db = sql();
  await withRetry(() => db`
    INSERT INTO orders (ref, created_at, status, channel, payment, customer, lines, totals, invoice, updated_at)
    VALUES (${order.ref}, ${order.createdAt}, ${order.status}, ${order.channel}, ${order.payment},
            ${JSON.stringify(order.customer)}, ${JSON.stringify(order.lines)}, ${JSON.stringify(order.totals)},
            ${order.invoice ? JSON.stringify(order.invoice) : null}, now())
    ON CONFLICT (ref) DO UPDATE SET
      status = EXCLUDED.status,
      invoice = EXCLUDED.invoice,
      updated_at = now()
  `);
}

export async function getOrder(ref) {
  await migrate();
  const db = sql();
  const rows = await withRetry(() => db`SELECT * FROM orders WHERE ref = ${ref}`);
  return rows[0] || null;
}

export async function insertEvent(ref, status, note = null) {
  await migrate();
  const db = sql();
  await withRetry(() => db`INSERT INTO order_events (order_ref, status, note) VALUES (${ref}, ${status}, ${note})`);
}

export async function listEvents(ref) {
  await migrate();
  const db = sql();
  return withRetry(() => db`SELECT * FROM order_events WHERE order_ref = ${ref} ORDER BY at ASC`);
}

export async function listOrders({ status, q, limit = 100 } = {}) {
  await migrate();
  const db = sql();
  return withRetry(async () => {
    if (status && q) {
      const needle = `%${q}%`;
      return db`
        SELECT * FROM orders WHERE status = ${status}
        AND (ref ILIKE ${needle} OR customer->>'name' ILIKE ${needle} OR customer->>'email' ILIKE ${needle})
        ORDER BY created_at DESC LIMIT ${limit}
      `;
    }
    if (status) return db`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC LIMIT ${limit}`;
    if (q) {
      const needle = `%${q}%`;
      return db`
        SELECT * FROM orders WHERE ref ILIKE ${needle} OR customer->>'name' ILIKE ${needle} OR customer->>'email' ILIKE ${needle}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
    }
    return db`SELECT * FROM orders ORDER BY created_at DESC LIMIT ${limit}`;
  });
}

export async function insertEnquiry({ formType, name, email, phone, message, payload }) {
  await migrate();
  const db = sql();
  await withRetry(() => db`
    INSERT INTO enquiries (form_type, name, email, phone, message, payload)
    VALUES (${formType}, ${name}, ${email || null}, ${phone || null}, ${message || null}, ${JSON.stringify(payload || {})})
  `);
}

export async function listEnquiries({ type, q, limit = 100 } = {}) {
  await migrate();
  const db = sql();
  return withRetry(async () => {
    if (type && q) {
      const needle = `%${q}%`;
      return db`
        SELECT * FROM enquiries WHERE form_type = ${type}
        AND (name ILIKE ${needle} OR email ILIKE ${needle} OR message ILIKE ${needle})
        ORDER BY created_at DESC LIMIT ${limit}
      `;
    }
    if (type) return db`SELECT * FROM enquiries WHERE form_type = ${type} ORDER BY created_at DESC LIMIT ${limit}`;
    if (q) {
      const needle = `%${q}%`;
      return db`
        SELECT * FROM enquiries WHERE name ILIKE ${needle} OR email ILIKE ${needle} OR message ILIKE ${needle}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
    }
    return db`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT ${limit}`;
  });
}

// Rebuilds the token-shaped order object from a stored DB row. The token
// itself is never stored -- only the order data -- so every order-detail
// link (portal list, notification email) regenerates a fresh token
// server-side via signOrder(orderFromRow(row)) rather than reusing one.
export function orderFromRow(row) {
  return {
    ref: row.ref,
    createdAt: row.created_at,
    status: row.status,
    channel: row.channel,
    payment: row.payment,
    customer: row.customer,
    lines: row.lines,
    totals: row.totals,
    invoice: row.invoice || null,
  };
}

export async function dashboardStats() {
  await migrate();
  const db = sql();
  return withRetry(async () => {
    const [totals] = await db`
      SELECT
        count(*)::int AS total_orders,
        count(*) FILTER (WHERE status IN ('new', 'invoice_sent'))::int AS needs_action,
        coalesce(sum((totals->>'total')::numeric) FILTER (WHERE status IN ('paid', 'dispatched')), 0)::float AS settled_revenue,
        coalesce(sum((totals->>'total')::numeric) FILTER (WHERE status IN ('new', 'invoice_sent')), 0)::float AS pipeline_value
      FROM orders
    `;
    const [enq] = await db`SELECT count(*)::int AS total_enquiries FROM enquiries`;
    return { ...totals, ...enq };
  });
}
