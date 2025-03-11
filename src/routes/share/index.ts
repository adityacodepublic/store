import { Hono } from "hono";
import { string, object } from "zod";
import { zValidator } from "@hono/zod-validator";
import { removeShare, shareFile } from "@/db/file";

const app = new Hono();

export const shareSchema = object({
  from_user_id: string().min(1),
  to_user_id: string().min(1),
  file_key: string().min(1),
});

// Get Upload presigned URL
app.post("/", zValidator("json", shareSchema), async (c) => {
  try {
    let data = c.req.valid("json");

    // share 
    const url = shareFile(data);

    return c.json({ success: url }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.post("/remove", zValidator("json", shareSchema), async (c) => {
  try {
    let data = c.req.valid("json");

    // share 
    const url = removeShare(data);

    return c.json({ success: url }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});


export default app;