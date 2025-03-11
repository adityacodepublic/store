import { string, object } from "zod";
import { Hono } from "hono";
import { uploadFile } from "@/s3";
import { upsertFile } from "@/db/file";
import { getKey } from "@/routes/utils";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

export const fileSchema = object({
  key: string().min(1),
  size: string().min(1),
  doc_type: string().min(1),
  user_id: string().min(1),
});

// Get Upload presigned URL
app.post("/", zValidator("json", fileSchema), async (c) => {
  try {
    let data = c.req.valid("json");
    data.key = getKey({ user_id: data.user_id, key: data.key });

    // create presign url and return
    const url = uploadFile(data.key);

    return c.json({ success: url }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});


// Confirm upload 
app.post("/confirm", zValidator("json", fileSchema), async (c) => {
  try {
    let data = c.req.valid("json");
    data.key = getKey({ user_id: data.user_id, key: data.key });

    // set data to db
    const db = await upsertFile(data);

    return c.json({ success: "file added to the db successfully" }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;

/*

CLIENT
const fileData = await Bun.file("Docin.mp4").arrayBuffer();
await fetch(uploadUrl.url, {
  method: "PUT",
  body: fileData,
  headers: {
    "Content-Type": uploadUrl.contentType,
  },
});

SERVER
// create refrence
const s3File = s3.file("uploads/local-image.jpg");
// upload file directly
await s3File.write(Bun.file("local-image.jpg"), {
  type: "image/jpeg"
});

*/
