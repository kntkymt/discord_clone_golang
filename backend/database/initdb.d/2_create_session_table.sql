USE discord_clone_database;

DROP TABLE IF EXISTS sessions;

CREATE TABLE sessions (
	token CHAR(43) PRIMARY KEY,
	data BLOB NOT NULL,
	expiry TIMESTAMP(6) NOT NULL
);

CREATE INDEX sessions_expiry_idx ON sessions (expiry);