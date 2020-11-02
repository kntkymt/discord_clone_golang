package database

import (
	"errors"

	"github.com/kntkymt/discord_clone_server/server/model/db"
)

func (dbManager *DBManager) GetChannel(id int) (*db.Channel, error) {
	// getError はgorpの設定ミスの時 Logic failureっぽい
	var object, getError = dbManager.DBMap.Get(db.Channel{}, id)
	if getError != nil {
		return nil, getError
	}

	// 型アサーション
	var entity, error = object.(*db.Channel)
	if !error {
		return nil, errors.New("not found")
	}

	return entity, nil
}

func (dbManager *DBManager) GetAllChannelsInServer(id int) ([]db.Channel, error) {
	var objects []db.Channel
	var _, error = dbManager.DBMap.Select(&objects, "select * from channel WHERE chat_server_id = ? order by id", id)
	if error != nil {
		return nil, error
	}

	return objects, nil
}
