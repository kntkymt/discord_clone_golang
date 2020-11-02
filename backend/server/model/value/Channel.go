package value

import "time"

type Channel struct {
	ID         int64     `json:"id"`
	Name       string    `json:"name"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}
