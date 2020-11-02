package controller

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/alexedwards/scs/v2"
	"github.com/go-chi/chi"

	"github.com/kntkymt/discord_clone_server/server/api/database"
	"github.com/kntkymt/discord_clone_server/server/model/value"
)

type ChatServerController struct {
	dbManager      *database.DBManager
	sessionManager *scs.SessionManager
}

func NewChatServerController(dbManager *database.DBManager, sessionManager *scs.SessionManager) *ChatServerController {
	return &ChatServerController{dbManager: dbManager, sessionManager: sessionManager}
}

func (chatServerController *ChatServerController) HandleGet(writer http.ResponseWriter, request *http.Request) {
	var id, error = strconv.Atoi(chi.URLParam(request, "serverID"))
	var userId = chatServerController.sessionManager.GetInt(request.Context(), "userId")

	if error != nil {
		log.Print("failed to parce serverID", error)
		http.Error(writer, "bad request. server id must be number.", http.StatusBadRequest)
		return
	}

	var object, getError = chatServerController.dbManager.GetChatServer(id)
	if getError != nil {
		log.Print("failed to get user", getError)
		http.Error(writer, "not found.", http.StatusNotFound)
		return
	}

	var channelObjects, channelError = chatServerController.dbManager.GetAllChannelsInServer(id)
	if channelError != nil {
		log.Print("failed to load channels: ", channelError)
		http.Error(writer, "internal error", http.StatusInternalServerError)
		return
	}
	var channels = []value.Channel{}
	for _, channel := range channelObjects {
		channels = append(channels, channel.ToValue())
	}

	var userObjects, userError = chatServerController.dbManager.GetAllUsersInServer(id)
	if userError != nil {
		log.Print("failed to load users: ", userError)
		http.Error(writer, "internal error", http.StatusInternalServerError)
		return
	}
	var users = []value.User{}
	for _, user := range userObjects {
		users = append(users, user.ToValue())
	}

	// 取得するサーバーに自分が入ってなかったら認証エラー
	var contains = false
	for _, user := range users {
		contains = user.ID == int64(userId)
	}

	if !contains {
		log.Print("unauthorized")
		http.Error(writer, "you don't have permission to get this server.", http.StatusUnauthorized)
		return
	}

	var value = object.ToValue(users, channels)
	fmt.Fprintln(writer, toJSON(value))

	defer request.Body.Close()
}
