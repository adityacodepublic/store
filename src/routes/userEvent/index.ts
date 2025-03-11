import { Hono } from "hono";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/backend";
import { deleteUser, upsertUser } from "@/db/user";

const app = new Hono();

app.post("/", async (c) => {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers and body
  const headers = c.req.header();
  const payload = await c.req.json();

  // Get Svix headers for verification
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return c.json(
      {
        success: false,
        message: "Error: Missing svix headers",
      },
      400
    );
  }

  let evt: WebhookEvent;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If verification fails, error out and return error code
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    }) as WebhookEvent;
  } catch (err: any) {
    console.log("Error: Could not verify webhook:", err.message);
    return c.json(
      {
        success: false,
        message: err.message,
      },
      400
    );
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  if(evt.type === 'user.created' || evt.type === 'user.updated') {
    const userData = {
      id:evt.data.id,
      name: `${evt.data.first_name} ${evt.data.last_name}`,
      email:evt.data.email_addresses[0].email_address,
      image_url:evt.data.image_url
    }
    const res = await upsertUser(userData);
    if(res && typeof res === 'boolean') console.log("user successfully created / updated");
    else if(res instanceof Error) console.log(res);
  }
  else if ( evt.type === 'user.deleted' && evt.data.id) {
    const res = await deleteUser(evt.data.id);
    if(res && typeof res === 'boolean') console.log("user successfully deleted");
    else if(res instanceof Error) console.log(res);
  }
  // console.log("Webhook payload:", evt.data);

  return c.json(
    {
      success: true,
      message: "Webhook received",
    },
    200
  );
});

export default app;
