package router

import (
	"net/http"

	"github.com/alexedwards/scs/mysqlstore"
	scs "github.com/alexedwards/scs/v2"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"

	"github.com/kntkymt/discord_clone_server/server/api/controller"
	"github.com/kntkymt/discord_clone_server/server/api/database"
)

func CreateHandler(dbManager *database.DBManager) http.Handler {
	var router = chi.NewRouter()

	router.Use(middleware.Logger)
	router.Use(Cors)

	var sessionManager = scs.New()

	// セッション永続化
	sessionManager.Store = mysqlstore.New(dbManager.DBMap.Db)
	router.Use(sessionManager.LoadAndSave)

	var userController = controller.NewUserController(dbManager, sessionManager)
	var chatServerController = controller.NewChatServerController(dbManager, sessionManager)
	var channelController = controller.NewChannelController(dbManager, sessionManager)

	// MARK: - No Auth

	// ユーザーを作成する
	router.Post("/users", userController.HandlePost)

	// MARK: - Auth

	// /privateつけなくても良い様にしたい
	router.Route("/private", func(subRouter chi.Router) {
		var authMiddleware = NewAuthMiddleware(sessionManager)
		subRouter.Use(authMiddleware.Handler)

		/// 自分を削除する
		subRouter.Delete("/me", userController.HandleDeleteMe)

		/// 自分を取得する
		subRouter.Get("/me", userController.HandleGetMe)

		/// 自分が属しているサーバーを取得する
		subRouter.Get("/me/servers", userController.HandleGetAllMyServers)

		/// 特定のサーバーを取得する
		subRouter.Get("/servers/{serverID}", chatServerController.HandleGet)

		/// 特定のチャンネルを取得する
		subRouter.Get("/channels/{channelID}", channelController.HandleGet)

		/// 特定のチャンネルのメッセージを取得する
		subRouter.Get("/channels/{channelID}/messages", channelController.HandleMessageGet)

		/// 特定のチャンネルにメッセージを送信する
		subRouter.Post("/channels/{channelID}/messages", channelController.HandleMessagePost)
	})

	return router
}
