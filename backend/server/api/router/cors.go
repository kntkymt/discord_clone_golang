package router

import (
	"github.com/go-chi/cors"
)

var Cors = cors.Handler(cors.Options{
	AllowedOrigins:   []string{"http://localhost:3000"},
	AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	ExposedHeaders:   []string{"Link"},
	AllowCredentials: true,
	MaxAge:           300,
})
