import { s3, sql } from "bun";
import { Hono } from "hono";
import { getuploadUrl } from "./actions/upload";
import { getFileUrl } from "./actions/download";
import { deleteFile } from "./actions/delete";
import { Webhook } from "svix";

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

interface WebhookEvent {
  type: string;
  data: {
    id: string;
    [key: string]: any;
  };
}

app.post(
  '/api/webhooks', async (c) => {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers and body
    const headers = c.req.header();
    const payload = await c.req.json();


    // Get Svix headers for verification
    const svix_id = headers['svix-id']
    const svix_timestamp = headers['svix-timestamp']
    const svix_signature = headers['svix-signature']

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return c.json({
        success: false,
        message: 'Error: Missing svix headers'
      }, 400);
    }

    let evt: WebhookEvent

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If verification fails, error out and return error code
    try {
      evt = wh.verify(JSON.stringify(payload), {
        'svix-id': svix_id as string,
        'svix-timestamp': svix_timestamp as string,
        'svix-signature': svix_signature as string,
      }) as WebhookEvent;
    } catch (err: any) {
      console.log('Error: Could not verify webhook:', err.message)
      return c.json({
        success: false,
        message: err.message
      }, 400);
    }

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    return c.json({
      success: true,
      message: 'Webhook received'
    }, 200);
  },
)
export default app;

