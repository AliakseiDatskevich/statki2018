# Statki serwer

Serwer http i websocket'owy

## Instalacja

Będąc w folderze głównym serwera wpisujemy w konsoli poniższą komendę:

```
npm i
```

## Uruchamianie

Moduł serwera składa się z 2 części. Plik server.js jest serwerem http, a plik wsserver.js jest serwerem websocket'owym.
Trzeba uruchomić oba serwery jako oddzielne procesy poniższymi komendami:

```
node server.js
node wsserver.js
```

## Serwer http

Adres: http://localhost:8080

### /user/register

Request:
```
{
	"username": "username",
	"password": "password"
}
```

Response:
```
{
	"status": "success" || "warning",
	"info": "info",
	"userId": "userId"
}
```

### /user/login

Request:
```
{
	"username": "username",
	"password": "password"
}
```

Response:
```
{
	"status": "success" || "warning",
	"info": "info",
	"userId": "userId"
}
```

## Serwer websocket

Adres: ws://localhost:80

### connect

Kiedy nastąpi połączenie z serwerem to wysyła on klientowi poniższy pakiet:
```
{
	"packetName": "connect",
	"status": "success",
	"games": [
		{
			"_id": "game_1",
			"status": "waiting"
		},
		{
			"_id": "game_2",
			"status": "waiting"
		}
	]
}
```

### create

Request:
```
{
	"packetName": "create",
	"userId": "userId"
}
```

Response:
```
{
	"packetName": "create",
	"gameId": "gameId",
	"status": "success"
}
```

### join

Request:
```
{
	"packetName": "join",
	"userId": "userId",
	"gameId": "gameId"
}
```

Response:
```
{
	"packetName": "join",
	"gameId": "gameId",
	"status": "success" || "failed"
}
```

### board

Request:
```
{
	"packetName": "board",
	"userId": "userId",
	"gameId": "gameId",
	"board": [] (tablica zgodna z plikiem playerBoard.json)
}
```

Response:
```
{
	"packetName": "board",
	"gameId": "gameId",
	"status": "success"
}
```

### playerShot

Request:
```
{
	"packetName": "playerShot",
	"userId": "userId",
	"gameId": "gameId",
	"shot": {
		"x": "A",
		"y": 1
	}
}
```

Response:
```
{
	"packetName": "playerShot" || "opponentShot",
	"gameId": "gameId",
	"status": "miss" || "hit" || "sink",
	"shot": {} || [] (jest tablicą gdy status to "sink")
}
```

### endGame

Ten pakiet zawsze idzie od serwera do graczy.
Może wystąpić po wysłaniu pakietu 'playerShot' jeżeli jednemu z graczy uda się zatopić wszystkie statki przeciwnika.

```
{
	"packetName": "endGame",
	"gameId": "gameId",
	"winner": "you" || "opponent"
}
```