import { sql } from "bun";

interface User {
  id: string;
  name: string;
  email: string;
  image_url: string;
}

export async function upsertUser(data: User): Promise<boolean | Error> {
  try {
    const res = await sql`
      INSERT INTO users (id, name, email, image_url)
      VALUES (${data.id}, ${data.name}, ${data.email}, ${data.image_url})
      ON CONFLICT (id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        image_url = EXCLUDED.image_url;
    `;

    return res.count > 0;
  } catch (error) {
    return new Error(
      `Failed to create user: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}

export async function deleteUser(userId: string): Promise<boolean | Error> {
  try {
    const res = await sql`
      DELETE FROM users
      WHERE id = ${userId}
    `;
    return res.count > 0;
  } catch (error) {
    return new Error(
      `Failed to delete user: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
}
