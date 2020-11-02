package db

type ChatServerUser struct {
	ID           int64 `db:"id,primarykey,autoincrement"`
	ChatServerID int64 `db:"chat_server_id"`
	UserID       int64 `db:"user_id"`
}
