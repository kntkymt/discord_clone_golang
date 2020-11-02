package value

import "time"

type ChatServer struct {
	ID         int64     `json:"id"`
	Name       string    `json:"name"`
	Users      []User    `json:"users"`
	Channels   []Channel `json:"channels"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}
