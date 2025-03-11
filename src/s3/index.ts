import { s3 } from "bun";
import { mapContent } from "@/routes/utils";
const expiryTime = 60;

// CREATE
// UPDATE
export function uploadFile(fileName: string) {
  const contentType = mapContent(fileName);
  const imageFile = s3.file(fileName);
  const url = imageFile.presign({
    expiresIn: expiryTime,
    method: "PUT",
    type: contentType,
  });
  return { url, contentType };
}

// READ
export function getFile(fileName: string) {
  const fileRef = s3.file(fileName);
  const url = fileRef.presign({
    acl: "public-read",
    expiresIn: expiryTime,
  });
  return url;
}

// DELETE
export async function deleteFile(fileName: string):Promise<boolean> {
  try {
    await s3.delete(fileName);
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}
