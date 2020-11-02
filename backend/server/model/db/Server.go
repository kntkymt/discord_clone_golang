package db

import (
	"time"

	"github.com/kntkymt/discord_clone_server/server/model/value"
)

type ChatServer struct {
	ID         int64     `db:"id,primarykey,autoincrement"`
	Name       string    `db:"name"`
	CreateTime time.Time `db:"create_time"`
	UpdateTime time.Time `db:"update_time"`
}

func (object ChatServer) ToValue(users []value.User, channels []value.Channel) value.ChatServer {
	return value.ChatServer{
		ID:         object.ID,
		Name:       object.Name,
		Users:      users,
		Channels:   channels,
		CreateTime: object.CreateTime,
		UpdateTime: object.UpdateTime}
}
