package database

import (
	"errors"

	"github.com/kntkymt/discord_clone_server/server/model/db"
)

func (dbManager *DBManager) GetUser(id int) (*db.User, error) {
	// getError はgorpの設定ミスの時 Logic failureっぽい
	var object, getError = dbManager.DBMap.Get(db.User{}, id)
	if getError != nil {
		return nil, getError
	}

	// 型アサーション
	var entity, error = object.(*db.User)
	if !error {
		return nil, errors.New("not found")
	}

	return entity, nil
}

func (dbManager *DBManager) GetAllUsers() ([]db.User, error) {
	var objects []db.User
	var _, error = dbManager.DBMap.Select(&objects, "select * from user order by id")
	if error != nil {
		return nil, error
	}

	return objects, nil
}

func (dbManager *DBManager) GetAllUsersInServer(id int) ([]db.User, error) {
	// 中間テーブル取得
	var chatServerUsers, error = dbManager.GetAllChatServerUserByServer(id)
	if error != nil {
		return nil, error
	}

	// 中間テーブルからUserを取得
	var objects []db.User
	for _, chatServerUser := range chatServerUsers {
		var user, getError = dbManager.GetUser(int(chatServerUser.UserID))

		// とりあえず1個でもミスったらエラーに
		if getError != nil {
			return nil, getError
		}

		objects = append(objects, *user)
	}

	return objects, nil
}

func (dbManager *DBManager) InsertUser(user *db.User) error {
	var insertError = dbManager.DBMap.Insert(user)
	if insertError != nil {
		return insertError
	}

	return nil
}

func (dbManager *DBManager) DeleteUser(id int) error {
	var user, getError = dbManager.GetUser(id)

	if getError != nil {
		return getError
	}

	var _, deleteError = dbManager.DBMap.Delete(user)
	if deleteError != nil {
		return deleteError
	}

	return nil
}
