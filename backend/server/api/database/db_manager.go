package database

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/kntkymt/discord_clone_server/server/model/db"
	"gopkg.in/gorp.v2"
)

type DBManager struct {
	DBMap *gorp.DbMap
}

func CreateManager(user string, password string) *DBManager {
	var source = user + ":" + password + "@tcp(mysql-container:3306)/discord_clone_database?parseTime=true"
	var db, error = sql.Open("mysql", source)
	if error != nil {
		log.Fatal("error connecting to database:", error)
	}

	var gorpDialect = gorp.MySQLDialect{}
	var dbMap = &gorp.DbMap{Db: db, Dialect: gorpDialect}

	var manager = &DBManager{DBMap: dbMap}
	manager.setup()

	return manager
}

func (dbManager *DBManager) Close() {
	dbManager.DBMap.Db.Close()
}

func (dbManager *DBManager) setup() {
	// true = autoincrementを反映する
	dbManager.DBMap.AddTableWithName(db.Channel{}, "channel").SetKeys(true, "ID")
	dbManager.DBMap.AddTableWithName(db.Message{}, "message").SetKeys(true, "ID")
	dbManager.DBMap.AddTableWithName(db.ChatServer{}, "chat_server").SetKeys(true, "ID")
	dbManager.DBMap.AddTableWithName(db.User{}, "user").SetKeys(true, "ID")
	dbManager.DBMap.AddTableWithName(db.ChatServerUser{}, "chat_server_user").SetKeys(true, "ID")
}
