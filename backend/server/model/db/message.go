package db

import (
	"time"

	"github.com/kntkymt/discord_clone_server/server/model/value"
)

type Message struct {
	ID         int64     `db:"id,primarykey,autoincrement"`
	Content    string    `db:"content"`
	ChannelID  int64     `db:"channel_id"`
	UserID     int64     `db:"user_id"`
	CreateTime time.Time `db:"create_time"`
	UpdateTime time.Time `db:"update_time"`
}

func ToEntity(value value.Message, channelID int64, userID int64) Message {
	return Message{
		ID:         value.ID,
		Content:    value.Content,
		ChannelID:  channelID,
		UserID:     userID,
		CreateTime: value.CreateTime,
		UpdateTime: value.UpdateTime}
}

func (object Message) ToValue(user value.User) value.Message {
	return value.Message{
		ID:         object.ID,
		Content:    object.Content,
		User:       user,
		CreateTime: object.CreateTime,
		UpdateTime: object.UpdateTime}
}
