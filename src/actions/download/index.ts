import { s3 } from "bun";
const expiryTime = 60;

export function getFileUrl(fileName:string) {
  const fileRef = s3.file(fileName);
  const url = fileRef.presign({
    acl: "public-read",
    expiresIn: expiryTime // 60 seconds
  });
  return url;
}