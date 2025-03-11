import { object, string } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getAllTables, getFiles, getSharedFromMe, getSharedToMe } from "@/db/file";

const app = new Hono();

const userId = object({
  user_id:string().min(10)
});

app.post("/getMyFiles", zValidator("json", userId), async (c) => {
  try {
    const files = await getFiles(c.req.valid("json").user_id);

    return c.json(files, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.post("/getSharedToMe", zValidator("json", userId), async (c) => {
  try {
    const files = getSharedToMe(c.req.valid("json").user_id);

    return c.json({ success: files }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.post("/getSharedFromMe", zValidator("json", userId), async (c) => {
  try {
    const files = await getSharedFromMe(c.req.valid("json").user_id);

    return c.json({ success: files }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.get("/tables", async (c) => {
  try {
    const tables = await getAllTables();

    return c.json({ success: tables }, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;


/*

### TO CONVERT DATA TO OBJECT FOR FOLDER MAPPING 
### (play this in browser console)

function createFolderStructure(files) {
  const structure = {};

  files.forEach(file => {
    const parts = file.key.split('/');
    let current = structure;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Last part, assign the file object
        current[part] = file;
      } else {
        // Create nested folder if it doesn't exist
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return structure;
}

// Example usage:
const files = [
  {
    "key": "user_29w83sxmDNGwOuEthce5gg56FcC/uploads/local-image.jpg",
    "size": "5mb",
    "doc_type": "jpg",
    "user_id": "user_29w83sxmDNGwOuEthce5gg56FcC",
    "created_at": "2025-03-11T11:10:30.367Z"
  },
    {
    "key": "user_29w83sxmDNGwOuEthce5gg56FcC/uploads/local-image2.jpg",
    "size": "5mb",
    "doc_type": "jpg",
    "user_id": "user_29w83sxmDNGwOuEthce5gg56FcC",
    "created_at": "2025-03-11T11:10:30.367Z"
  },
    {
    "key": "user_29w83sxmDNGwOuEthce5gg56FcC/uploads/local-image3.jpg",
    "size": "5mb",
    "doc_type": "jpg",
    "user_id": "user_29w83sxmDNGwOuEthce5gg56FcC",
    "created_at": "2025-03-11T11:10:30.367Z"
  }
];

console.log(JSON.stringify(createFolderStructure(files), null, 2));


*/