# discord_clone_golang
## Overview
- [Discord](https://discord.com/) のReact + Golang製クローンアプリ
- [discord_clone_firebase](https://github.com/kntkymt/discord_clone_firebase) のバックエンドをGolangで記述したもの

## Develop
### backend
ビルドするためにはDockerが必要です。

1. `.env.sample`を参考に`.env`ファイルを作成し、任意のMySQLユーザー名, パスワードを設定してください。
1. `docker-compose up`にて80番ポートでバックエンドサーバーが起動します。

### client

1. `yarn start`にて3000番ポートでアプリが起動します。
[http://localhost:3000](http://localhost:3000)から確認できます。

### Cors対応について

デフォルトでは`localhost:3000`のみ許可する様にしているため、
localhost以外で起動する場合は`server/api/router/cors.go`及び`client/src/config/constants.ts`のURLを変更してください。

## License
MIT License
