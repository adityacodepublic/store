import { z } from "zod";
import { sql } from "bun";
import { fileSchema } from "@/routes/upload";
import { shareSchema } from "@/routes/share";

// FILES
export async function upsertFile(
  data: z.infer<typeof fileSchema>
): Promise<boolean | Error> {
  try {
    const res = await sql`
      INSERT INTO files (key, size, doc_type, user_id)
      VALUES (${data.key}, ${data.size}, ${data.doc_type}, ${data.user_id})
      ON CONFLICT (key) 
      DO UPDATE SET 
        size = EXCLUDED.size,
        doc_type = EXCLUDED.doc_type;
    `;

    return res.count > 0;
  } catch (error) {
    return new Error(
      `Failed to insert file: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}

export async function deleteFile(fileKey: string): Promise<boolean | Error> {
  try {
    const res = await sql`
      DELETE FROM files
      WHERE key = ${fileKey};
    `;
    return res.count > 0;
  } catch (error) {
    return new Error(
      `Failed to delete file: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}

export async function getFiles(
  userId: string
): Promise<z.infer<typeof fileSchema>[] | Error> {
  try {
    const res = await sql`
      SELECT * FROM files
      WHERE user_id = ${userId};
    `;
    return res;
  } catch (error) {
    return new Error(
      `Failed to get files: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}

// SHARE
export async function shareFile(
  data: z.infer<typeof shareSchema>
): Promise<boolean | Error> {
  try {
    const res = await sql`
      INSERT INTO share (from_user_id, to_user_id, file_key)
      VALUES (${data.from_user_id}, ${data.to_user_id}, ${data.file_key});
    `;

    return res.count > 0;
  } catch (error) {
    return new Error(
      `Failed to get shared files: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}

export async function removeShare(
  data: z.infer<typeof shareSchema>
): Promise<boolean | Error> {
  try {
    const res = await sql`
      DELETE FROM share 
      WHERE from_user_id = ${data.from_user_id} 
      AND to_user_id = ${data.to_user_id} 
      AND file_key = ${data.file_key};
    `;

    return res.count > 0;
  } catch (error) {
    return new Error(
      `Failed to get shared files: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}

// GET SHARE
export async function getSharedToMe(
  userId: string
): Promise<z.infer<typeof fileSchema>[] | Error> {
  try {
    const res = await sql`
      SELECT files.*, share.from_user_id, share.to_user_id, share.created_at
      FROM files JOIN share 
      ON files.key = share.file_key
      WHERE share.to_user_id = ${userId};
    `;
    return res;
  } catch (error) {
    return new Error(
      `Failed to get shared files: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}

// list of files shared to you
export async function getSharedFromMe(
  userId: string
): Promise<z.infer<typeof fileSchema>[] | Error> {
  try {
    const res = await sql`
      SELECT files.*, share.from_user_id, share.to_user_id, share.created_at
      FROM files JOIN share
      ON files.key = share.file_key
      WHERE share.from_user_id = ${userId};
    `;

    return res;
  } catch (error) {
    return new Error(
      `Failed to get my shared files: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}

export async function getAllTables(): Promise<string[] | Error> {
  try {
    const res = await sql`
      SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';
    `;
    const data = res
      .filter((item: { tablename: any }) => item.tablename)
      .map((item: { tablename: any }) => item.tablename);

    return data;
  } catch (error) {
    return new Error(
      `Failed to get all tables: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}
