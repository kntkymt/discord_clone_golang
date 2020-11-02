package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/alexedwards/scs/v2"
	"github.com/kntkymt/discord_clone_server/server/api/database"
	"github.com/kntkymt/discord_clone_server/server/api/requests"
	"github.com/kntkymt/discord_clone_server/server/model/db"
	"github.com/kntkymt/discord_clone_server/server/model/value"
)

type UserController struct {
	dbManager      *database.DBManager
	sessionManager *scs.SessionManager
}

func NewUserController(dbManager *database.DBManager, sessionManager *scs.SessionManager) *UserController {
	return &UserController{dbManager: dbManager, sessionManager: sessionManager}
}

func (userController *UserController) HandleGetMe(writer http.ResponseWriter, request *http.Request) {
	var userId = userController.sessionManager.GetInt(request.Context(), "userId")

	var object, getError = userController.dbManager.GetUser(userId)
	if getError != nil {
		log.Print("failed to get user", getError)
		http.Error(writer, "not found.", http.StatusNotFound)
		return
	}

	var value = object.ToValue()
	fmt.Fprintln(writer, toJSON(value))

	defer request.Body.Close()
}

func (userController *UserController) HandleGetAllMyServers(writer http.ResponseWriter, request *http.Request) {
	var userId = userController.sessionManager.GetInt(request.Context(), "userId")

	var objects, error = userController.dbManager.GetAllServersInUser(userId)
	if error != nil {
		log.Print("failed to load servers:", error)
		http.Error(writer, "internal error", http.StatusInternalServerError)
		return
	}

	var values = []value.ChatServer{}
	for _, object := range objects {
		var channelObjects, channelError = userController.dbManager.GetAllChannelsInServer(int(object.ID))
		if channelError != nil {
			log.Print("failed to load channels: ", error)
			http.Error(writer, "internal error", http.StatusInternalServerError)
			return
		}
		var channels = []value.Channel{}
		for _, channel := range channelObjects {
			channels = append(channels, channel.ToValue())
		}

		var userObjects, userError = userController.dbManager.GetAllUsersInServer(int(object.ID))
		if userError != nil {
			log.Print("failed to load users: ", error)
			http.Error(writer, "internal error", http.StatusInternalServerError)
			return
		}
		var users = []value.User{}
		for _, user := range userObjects {
			users = append(users, user.ToValue())
		}

		var chatServer = object.ToValue(users, channels)
		values = append(values, chatServer)
	}

	fmt.Fprintln(writer, toJSON(values))

	defer request.Body.Close()
}

func (userController *UserController) HandlePost(writer http.ResponseWriter, request *http.Request) {
	// BodyをByteへ
	var body, bodyError = ioutil.ReadAll(request.Body)
	if bodyError != nil && bodyError != io.EOF {
		log.Print(bodyError)
		http.Error(writer, "bad request. no body.", http.StatusBadRequest)
		return
	}

	var requestBody requests.PostUserRequest

	// Byte形式のBodyをパース
	if error := json.Unmarshal(body, &requestBody); error != nil {
		log.Print(error)
		http.Error(writer, "bad request. body json is invalid", http.StatusBadRequest)
		return
	}

	log.Printf("\"%s\" %s %s", request.Method, request.URL.Path, toJSON(requestBody))

	var entity = &db.User{
		Name:       requestBody.Name,
		CreateTime: time.Now(),
		UpdateTime: time.Now()}

	if error := userController.dbManager.InsertUser(entity); error != nil {
		log.Print("failed to insert user", error)
		http.Error(writer, "internal error", http.StatusInternalServerError)
		return
	}

	// sessionにログインの識別子を付与, ユーザーID設定(int64ではダメなのでintで保存)
	userController.sessionManager.Put(request.Context(), "auth", true)
	userController.sessionManager.Put(request.Context(), "userId", int(entity.ID))

	// ログイン後ID1, ID2のサーバーに追加
	if error := userController.dbManager.InsertChatServerUser(entity.ID, 1); error != nil {
		log.Print("failed to insert chatServerUser", error)
	}
	if error := userController.dbManager.InsertChatServerUser(entity.ID, 2); error != nil {
		log.Print("failed to insert chatServerUser", error)
	}

	// 成功
	writer.WriteHeader(http.StatusCreated)

	defer request.Body.Close()
}

func (userController *UserController) HandleDeleteMe(writer http.ResponseWriter, request *http.Request) {
	var userId = userController.sessionManager.GetInt(request.Context(), "userId")

	if error := userController.dbManager.DeleteUser(userId); error != nil {
		log.Print("failed to delete user", error)
		http.Error(writer, "internal error", http.StatusInternalServerError)
		return
	}

	// sessionの内容を削除
	userController.sessionManager.Remove(request.Context(), "auth")
	userController.sessionManager.Remove(request.Context(), "userId")

	// 成功
	writer.WriteHeader(http.StatusNoContent)

	defer request.Body.Close()
}

// 本当はuser.JSON()みたいな感じでやりたいけどメソッドの埋め込みをした際に、埋め込み先の生のメンバーの値を取れないので無理
func toJSON(value interface{}) string {
	var buf bytes.Buffer
	var encoder = json.NewEncoder(&buf)
	if error := encoder.Encode(value); error != nil {
		panic(fmt.Sprintf("unable to encode Object %T\n", value))
	}

	return buf.String()
}
