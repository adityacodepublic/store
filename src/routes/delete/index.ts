import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { deleteFile } from "@/db/file";
import { deleteFile as deleteS3File } from "@/s3";
import { getKey, keySchema } from "@/routes/utils";

const app = new Hono();

// Delete file
app.delete("/", zValidator("json", keySchema), async (c) => {
  try {
    let data = c.req.valid("json");

    // delete from s3
    const url = await deleteS3File(data.key);
    // delete from db
    if (url) {
      await deleteFile(data.key);
    }

    return c.json({ success: "deleted successfully" }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
