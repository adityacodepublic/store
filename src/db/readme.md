CREATE TABLE users (
    id TEXT PRIMARY KEY,         
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    image_url TEXT              
);

CREATE TABLE files (
    key TEXT PRIMARY KEY,         
    size TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users
    created_at TIMESTAMPTZ DEFAULT now(),
    (id) ON DELETE CASCADE
);

CREATE TABLE share (
    id SERIAL PRIMARY KEY,        
    from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- User sharing the file
    to_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,    -- User receiving the file
    file_key TEXT NOT NULL REFERENCES files(key) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (from_user_id, to_user_id, file_key)   -- Prevent duplicate shares between the same users
);
