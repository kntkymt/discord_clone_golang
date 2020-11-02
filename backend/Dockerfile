# バイナリ生成
FROM golang:1.15 AS build
WORKDIR /go/src
## ソースコードと.envをコピー
COPY ./server .
COPY .env .
## alpineで実行するために必要
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64
## ビルド(app)を作成
RUN go build -o app ./cmd/main.go

# サーバー実行環境
FROM alpine
## ビルドしたappを実行環境のappへ
COPY --from=build /go/src/app /app
## .envをコピー
COPY --from=build /go/src/.env /
EXPOSE 80
## 実行
ENTRYPOINT ["/app"]