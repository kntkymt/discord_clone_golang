package database

import (
	"errors"

	"github.com/kntkymt/discord_clone_server/server/model/db"
)

func (dbManager *DBManager) GetChatServer(id int) (*db.ChatServer, error) {
	// getError はgorpの設定ミスの時 Logic failureっぽい
	var object, getError = dbManager.DBMap.Get(db.ChatServer{}, id)
	if getError != nil {
		return nil, getError
	}

	// 型アサーション
	var entity, error = object.(*db.ChatServer)
	if !error {
		return nil, errors.New("not found")
	}

	return entity, nil
}

func (dbManager *DBManager) GetAllServersInUser(id int) ([]db.ChatServer, error) {
	// 中間テーブル取得
	var chatServerUsers, error = dbManager.GetAllChatServerUserByUser(id)
	if error != nil {
		return nil, error
	}

	var objects []db.ChatServer
	for _, chatServerUser := range chatServerUsers {
		var server, serverError = dbManager.GetChatServer(int(chatServerUser.ChatServerID))
		if serverError != nil {
			return nil, serverError
		}

		objects = append(objects, *server)
	}

	return objects, nil
}
