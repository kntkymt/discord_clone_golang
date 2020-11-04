package db

import (
	"time"

	"github.com/kntkymt/discord_clone_server/server/model/value"
)

type User struct {
	ID         int64     `db:"id,primarykey,autoincrement"`
	Name       string    `db:"name"`
	CreateTime time.Time `db:"create_time"`
	UpdateTime time.Time `db:"update_time"`
	// ServerIDs  []int64 `db:`
}

func (object User) ToValue() value.User {
	return value.User{
		ID:         object.ID,
		Name:       object.Name,
		CreateTime: object.CreateTime,
		UpdateTime: object.UpdateTime}
}
