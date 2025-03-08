import { SQL } from 'bun';
import { Hono } from 'hono';

const db = new SQL({
  url: "postgres://postgres:Rakesh27@database-1.c5ci48i8iai5.eu-north-1.rds.amazonaws.com:5432/storeIt",
  max: 20,
  idleTimeout: 30,
  maxLifetime: 0,
  connectionTimeout: 30,
  tls: true,
  onconnect: client => console.log("Connected to database"),
  onclose: client => console.log("Connection closed"),
});

const app = new Hono();

app.get('/', async (c) => {
  try {
    const result = await db`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    return c.json(result);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
