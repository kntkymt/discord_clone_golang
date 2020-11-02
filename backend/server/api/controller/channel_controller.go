package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/alexedwards/scs/v2"
	"github.com/go-chi/chi"
	"github.com/kntkymt/discord_clone_server/server/api/database"
	"github.com/kntkymt/discord_clone_server/server/api/requests"
	"github.com/kntkymt/discord_clone_server/server/model/db"
	"github.com/kntkymt/discord_clone_server/server/model/value"
)

type ChannelController struct {
	dbManager      *database.DBManager
	sessionManager *scs.SessionManager
}

func NewChannelController(dbManager *database.DBManager, sessionManager *scs.SessionManager) *ChannelController {
	return &ChannelController{dbManager: dbManager, sessionManager: sessionManager}
}

/// ユーザーが特定のサーバーに所属しているかどうかを返す
func (channelController *ChannelController) CheckIsJoinServer(id int, userId int) bool {
	var objects, error = channelController.dbManager.GetAllChatServerUserByServer(id)
	if error != nil {
		return false
	}

	var contains = false
	for _, object := range objects {
		contains = object.UserID == int64(userId)
	}

	return contains
}

func (channelController *ChannelController) HandleGet(writer http.ResponseWriter, request *http.Request) {
	var id, error = strconv.Atoi(chi.URLParam(request, "channelID"))
	var userId = channelController.sessionManager.GetInt(request.Context(), "userId")

	if error != nil {
		log.Print("failed to parce channelID", error)
		http.Error(writer, "bad request. channel id must be number.", http.StatusBadRequest)
		return
	}

	var object, getError = channelController.dbManager.GetChannel(id)
	if getError != nil {
		log.Print("failed to get channel", getError)
		http.Error(writer, "not found.", http.StatusNotFound)
		return
	}

	// 該当チャンネルに自分が存在するか調べる
	if authorized := channelController.CheckIsJoinServer(int(object.ServerID), userId); !authorized {
		log.Print("unauthorized")
		http.Error(writer, "you don't have permission to get this channel.", http.StatusUnauthorized)
		return
	}

	var value = object.ToValue()
	fmt.Fprintln(writer, toJSON(value))

	defer request.Body.Close()
}

func (channelController *ChannelController) HandleMessageGet(writer http.ResponseWriter, request *http.Request) {
	var id, error = strconv.Atoi(chi.URLParam(request, "channelID"))
	var userId = channelController.sessionManager.GetInt(request.Context(), "userId")

	// 該当チャンネルに自分が存在するか調べる
	var object, channelError = channelController.dbManager.GetChannel(id)
	if channelError != nil {
		log.Print("failed to get channel", channelError)
		http.Error(writer, "not found.", http.StatusNotFound)
		return
	}
	if authorized := channelController.CheckIsJoinServer(int(object.ServerID), userId); !authorized {
		log.Print("unauthorized")
		http.Error(writer, "you don't have permission to get this channel.", http.StatusUnauthorized)
		return
	}

	if error != nil {
		log.Print("failed to parce channelID", error)
		http.Error(writer, "bad request. channel id must be number.", http.StatusBadRequest)
		return
	}

	var objects, getError = channelController.dbManager.GetMessageInChannel(id)
	if getError != nil {
		log.Print("failed to get messages", getError)
		http.Error(writer, "not found.", http.StatusNotFound)
		return
	}

	var values = []value.Message{}
	for _, object := range objects {
		var userObject, userGetError = channelController.dbManager.GetUser(int(object.UserID))
		if userGetError != nil {
			// ユーザーが削除されてした時にMessageは消えないのでここでエラーが出る可能性あり
			log.Print("failed to get user", userGetError)
			http.Error(writer, "not found.", http.StatusNotFound)
			break
		}
		values = append(values, object.ToValue(userObject.ToValue()))
	}

	fmt.Fprintln(writer, toJSON(values))

	defer request.Body.Close()
}

func (channelController *ChannelController) HandleMessagePost(writer http.ResponseWriter, request *http.Request) {
	var userId = channelController.sessionManager.GetInt(request.Context(), "userId")
	var channelID, error = strconv.Atoi(chi.URLParam(request, "channelID"))

	// 該当チャンネルに自分が存在するか調べる
	var object, channelError = channelController.dbManager.GetChannel(channelID)
	if channelError != nil {
		log.Print("failed to get channel", channelError)
		http.Error(writer, "not found.", http.StatusNotFound)
		return
	}
	if authorized := channelController.CheckIsJoinServer(int(object.ServerID), userId); !authorized {
		log.Print("unauthorized")
		http.Error(writer, "you don't have permission to get this channel.", http.StatusUnauthorized)
		return
	}

	if error != nil {
		http.Error(writer, "bad request. server id must be number.", http.StatusBadRequest)
		return
	}

	// BodyをByteへ
	var body, bodyError = ioutil.ReadAll(request.Body)
	if bodyError != nil && bodyError != io.EOF {
		log.Print(bodyError)
		http.Error(writer, "bad request. no body.", http.StatusBadRequest)
		return
	}

	var requestBody requests.PostMessageRequest

	// Byte形式のBodyをパース
	if error := json.Unmarshal(body, &requestBody); error != nil {
		log.Print(error)
		http.Error(writer, "bad request. body json is invalid", http.StatusBadRequest)
		return
	}

	log.Printf("\"%s\" %s %s", request.Method, request.URL.Path, toJSON(requestBody))

	var entity = &db.Message{
		Content:    requestBody.Content,
		ChannelID:  int64(channelID),
		UserID:     int64(userId),
		CreateTime: time.Now(),
		UpdateTime: time.Now()}

	if error := channelController.dbManager.InsertMessage(entity); error != nil {
		log.Print("failed to insert message", error)
		http.Error(writer, "internal error", http.StatusInternalServerError)
		return
	}

	// 成功
	writer.WriteHeader(http.StatusCreated)

	defer request.Body.Close()
}
