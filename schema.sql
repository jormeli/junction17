
CREATE TABLE spotting(
    id PRIMARY KEY,
    vector_hash UNIQUE VARCHAR,
    vector BLOB,
    created_at DATETIME,
    spotted_at DATETIME,
    picture BLOB,
    location VARCHAR
);

CREATE UNIQUE INDEX IF NOT EXISTS vector_hash_index ON
    spotting(vector_hash);
