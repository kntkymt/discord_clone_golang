package database

import (
	"errors"

	"github.com/kntkymt/discord_clone_server/server/model/db"
)

func (dbManager *DBManager) GetMessage(id int) (*db.Message, error) {
	// getError はgorpの設定ミスの時 Logic failureっぽい
	var object, getError = dbManager.DBMap.Get(db.Message{}, id)
	if getError != nil {
		return nil, getError
	}

	// 型アサーション
	var entity, error = object.(*db.Message)
	if !error {
		return nil, errors.New("not found")
	}

	return entity, nil
}

func (dbManager *DBManager) GetMessageInChannel(id int) ([]db.Message, error) {
	var objects []db.Message
	var _, error = dbManager.DBMap.Select(&objects, "select * from message WHERE channel_id = ? order by id", id)
	if error != nil {
		return nil, error
	}

	return objects, nil
}

func (dbManager *DBManager) InsertMessage(message *db.Message) error {
	var insertError = dbManager.DBMap.Insert(message)
	if insertError != nil {
		return insertError
	}

	return nil
}
