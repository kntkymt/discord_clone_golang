package value

import "time"

type Message struct {
	ID         int64     `json:"id"`
	Content    string    `json:"content"`
	User       User      `json:"user"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}
