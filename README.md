To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000


sql manual method 
``` bash 
const db = new SQL({
  url: "postgres://username:pass@host:5432/dbname"
  max: 20,
  idleTimeout: 30,
  maxLifetime: 0,
  connectionTimeout: 30,
  tls: true,
  onconnect: client => console.log("Connected to database"),
  onclose: client => console.log("Connection closed"),
});
```


#### This Just Works
``` ts 
import { s3, write, S3Client } from "bun";

// Bun.s3 reads environment variables for credentials
// file() returns a lazy reference to a file on S3
const metadata = s3.file("123.json");

// Download from S3 as JSON
const data = await metadata.json();

// Upload to S3
await write(metadata, JSON.stringify({ name: "John", age: 30 }));

// Presign a URL (synchronous - no network request needed)
const url = metadata.presign({
  acl: "public-read",
  expiresIn: 60 * 60 * 24, // 1 day
});

// Delete the file
await metadata.delete();

```

#### Reading files from S3

If you've used the `fetch` API, you're familiar with the `Response` and `Blob` APIs. `S3File` extends `Blob`. The same methods that work on `Blob` also work on `S3File`.

```ts
// Read an S3File as text
const text = await s3file.text();

// Read an S3File as JSON
const json = await s3file.json();

// Read an S3File as an ArrayBuffer
const buffer = await s3file.arrayBuffer();

// Get only the first 1024 bytes
const partial = await s3file.slice(0, 1024).text();

// Stream the file
const stream = s3file.stream();
for await (const chunk of stream) {
  }

  ```

### upload object with stream 

  > Bun automatically handles multipart uploads for large files

  > server is handled easily by bun 

  > client ? need many signed urls list, 
  see https://chatgpt.com/share/67cd999a-c9c0-800b-9618-bd102297e7dc , need to research more

### See
// see accss control list at https://bun.sh/docs/api/s3#setting-acls

// listObjects see https://github.com/oven-sh/bun/pull/16948

// delete folders see https://g.co/gemini/share/2f3b17f82c58