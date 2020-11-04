package db

import (
	"time"

	"github.com/kntkymt/discord_clone_server/server/model/value"
)

type Channel struct {
	ID         int64     `db:"id,primarykey,autoincrement"`
	Name       string    `db:"name"`
	ServerID   int64     `db:"chat_server_id"`
	CreateTime time.Time `db:"create_time"`
	UpdateTime time.Time `db:"update_time"`
}

func (object Channel) ToValue() value.Channel {
	return value.Channel{
		ID:         object.ID,
		Name:       object.Name,
		CreateTime: object.CreateTime,
		UpdateTime: object.UpdateTime}
}
