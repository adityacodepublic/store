import { sql } from 'bun';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    return c.json(result);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
