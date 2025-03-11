import { Hono } from "hono";
import db from "@/routes/db";
import share from "@/routes/share";
import upload from "@/routes/upload";
import user from "@/routes/userEvent";
import deleteFile from "@/routes/delete";
import download from "@/routes/download";

const app = new Hono();

// DB - get files sql data
app.route("/db", db);

// USER
app.route("/api/webhooks", user);

// FILE
app.route("/file/upload", upload);
app.route("/file/get", download);
app.route("/file/share", share);
app.route("/file/delete", deleteFile);

export default app;

