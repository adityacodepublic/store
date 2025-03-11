import { Hono } from "hono";
import { getFile } from "@/s3";
import { getKey, keySchema } from "@/routes/utils";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.post("/", zValidator("json", keySchema), async (c) => {
  try {
    const key = getKey(c.req.valid("json"));
    const url = getFile(key);

    return c.json({ success: url }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;

/*

  CLIENT
  // redirect
  const url = getFile("cv.pdf");
  // quick redirect to presigned url
  return c.redirect(url);

  SERVER
  const imageFile = s3.file("cv.pdf");
  // quick redirect to file url
  return new Response(imageFile);
  // download
  const imageData = await imageFile.arrayBuffer();
  await Bun.write("downloads.jpg", new Uint8Array(imageData));

*/

/*
CLIENT
### Axios Download (Progress Tracking)
If you need to track the download progress:

import axios from "axios";

const handleDownload = async () => {
  const fileUrl = "https://your-s3-url"; // Replace with actual URL

  try {
    const response = await axios.get(fileUrl, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        console.log(`Download Progress: ${percentCompleted}%`);
      },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "filename.ext"; // Adjust as needed
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed", error);
  }
};


### redirect
window.location.href = "https://your-s3-url.com";

*/