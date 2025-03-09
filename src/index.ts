import { sql, s3 } from 'bun';
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

app.get('/image', async (c) => {
  try {
    const imageFile = s3.file("pn.jpeg");    
    const imageData = await imageFile.arrayBuffer();
    await Bun.write("local-image.jpg", new Uint8Array(imageData));
    return c.json({ success: "wow worked" }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;


// get object download presigned url
// get object presigned url with expiry 

// upload object with presigned url with expiry