To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000


### sql manual 
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