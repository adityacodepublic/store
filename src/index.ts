import { Hono } from "hono";
import { s3, sql } from "bun";
import { getuploadUrl } from "./actions/upload";
import { getFileUrl } from "./actions/download";
import { deleteFile } from "./actions/delete";
import user from "./actions/user";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const result =
      await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    return c.json(result);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// GET
app.get("/d", async (c) => {
  try {
    // CLIENT
    // Presign URL for 50 seconds
    const url = getFileUrl("cv.pdf");
    // Quick Redirect
    // with presigned expiry
    // return c.redirect(url);

    // // SERVER
    // const imageFile = s3.file("cv.pdf");
    // // Quick Redirect
    // // to file url
    // return new Response(imageFile);
    // // DOWNLOAD
    // const imageData = await imageFile.arrayBuffer();
    // await Bun.write("downloads.jpg", new Uint8Array(imageData));

    return c.json({ success: url }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// PUT
app.get("/u", async (c) => {
  try {
    // CLIENT
    // Upload using presigned URL
    // dont do here on server side
    // do auth here and send url to client side
    const uploadUrl = getuploadUrl("uploads/docin.mp4");
    const fileData = await Bun.file("Docin.mp4").arrayBuffer();
    await fetch(uploadUrl.url, {
      method: "PUT",
      body: fileData,
      headers: {
        "Content-Type": uploadUrl.contentType,
      },
    });
    // Generate presigned URL for the uploaded file to view
    const url = getFileUrl("uploads/docin.mp4");

    // SERVER
    // // upload file directly
    // // create refrence
    // const s3File = s3.file("uploads/local-image.jpg");
    // await s3File.write(Bun.file("local-image.jpg"), {
    //   type: "image/jpeg"
    // });

    return c.json({ success: url }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// DELETE
app.get("/del", async (c) => {
  try {
    // only delete files
    await deleteFile("uploads/docin.mp4");
    return c.json({ success: "deleted" }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.route('/api/webhooks', user);


export default app;

