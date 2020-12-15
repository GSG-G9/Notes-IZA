BEGIN;

DROP TABLE IF EXISTS users, notes CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email  VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255)  NOT NULL,
  bio TEXT NOT NULL
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY NOT NULL,
  header VARCHAR(255),
  content TEXT,
  userID INTEGER REFERENCES users(id) ON UPDATE CASCADE
);

COMMIT;