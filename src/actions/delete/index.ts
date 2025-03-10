import { s3 } from "bun";

export async function deleteFile(fileName:string) {
  try {
    const fileDel =  await s3.file(fileName).delete();
    
  } catch (error) {
    console.log("error",error);
  }
  return true;
}