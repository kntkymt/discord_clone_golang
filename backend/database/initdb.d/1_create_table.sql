USE discord_clone_database;

DROP TABLE IF EXISTS chat_server;
DROP TABLE IF EXISTS channel;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS chat_server_user;

CREATE TABLE chat_server (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
  update_time TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE channel (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  chat_server_id INTEGER NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
  update_time TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE user (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
  update_time TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE message (
  id SERIAL NOT NULL PRIMARY KEY,
  content TEXT NOT NULL,
  channel_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
  update_time TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE chat_server_user (
  id SERIAL NOT NULL PRIMARY KEY,
  chat_server_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL
);
