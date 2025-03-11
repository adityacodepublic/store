import { z } from "zod";

export const mapContent = (fileName:string):string => {
  const contentTypeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.mkv': 'video/x-matroska',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.zip': 'application/zip',
    '.txt': 'text/plain'
  };

  const extension = fileName.toLowerCase().match(/\.[^\.]*$/)?.[0] || '';
  const contentType = contentTypeMap[extension] || 'application/octet-stream';
  return contentType;
};

export const keySchema = z.object({
  user_id: z.string().min(1),
  key: z.string().min(1), 
});

export const getKey = (data: z.infer<typeof keySchema>): string => {
  return `${data.user_id}/${data.key}`;
};