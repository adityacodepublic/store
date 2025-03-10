import { s3 } from "bun";
import { mapContent } from "../utils";
const expiryTime = 120;

export function getuploadUrl(fileName: string) {
  const contentType = mapContent(fileName);
  const imageFile = s3.file(fileName);
  const url = imageFile.presign({
    expiresIn: expiryTime,
    method: "PUT",
    type: contentType,
  });
  return {url, contentType};
}