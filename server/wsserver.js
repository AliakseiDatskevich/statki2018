const _ = require('lodash');
const WebSocket = require('ws');

var db = require('./db/dbservice.js');

const wss = new WebSocket.Server({ port: 80 });

var users = {};
var activeGames = {};
 
wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);
    
    var userId = msg.userId;
    var action = msg.packetName;
    
    if(userId !== undefined && action !== undefined) {
    	if(action === 'create') {
            console.log('create', userId);
    		db.createGame({ player1: userId, status: 'waiting'})
    		.then((game) => {
    			users[userId] = ws;
    			ws.send(JSON.stringify({ status: 'success', gameId: game._id, packetName: 'create' }));
    		});
    	} else if(action === 'join') {
            console.log('join', userId, msg.gameId);
    		db.findGameById(msg.gameId)
    		.then((game) => {
                if(game.status === 'waiting') {
                    game.player2 = userId;
                    game.player1Status = 'notready';
                    game.player2Status = 'notready';
                    game.status = 'starting';
                    db.updateGame(game)
                    .then((game) => {
                        activeGames[game._id] = game;
                        users[userId] = ws;
                        ws.send(JSON.stringify({ status: 'success', gameId: game._id, packetName: 'join' }));
                        users[game.player1].send(JSON.stringify({ status: 'success', gameId: game._id, packetName: 'join' }));
                    });
                } else {
                    ws.send(JSON.stringify({ status: 'failed', gameId: game._id, packetName: 'join' }));
                }
    		});
    	} else if(action === 'board') {
            console.log('board', userId, msg.gameId);
    		var game = activeGames[msg.gameId];
    		var playerBoard = msg.board;

    		if(game.player1 === userId) {
    			game.player1Board = playerBoard;
    			game.player1Status = 'ready';
    		} else if(game.player2 === userId) {
    			game.player2Board = playerBoard;
    			game.player2Status = 'ready';
    		}

    		if(game.player1Status === 'ready' && game.player2Status === 'ready') {
    			users[game.player1].send(JSON.stringify({ status: 'success', gameId: game._id, packetName: 'board' }));
    			users[game.player2].send(JSON.stringify({ status: 'success', gameId: game._id, packetName: 'board' }));
                game.status = 'started';
    		}
            db.updateGame(game);
    	} else if(action === 'playerShot') {
            console.log('playerShot', userId, msg.gameId);
            var game = activeGames[msg.gameId];
            var shot = msg.shot;
            var board, status = 'miss';
            
            if(game.player1 === userId) {
                board = game.player2Board;
            } else if(game.player2 === userId) {
                board = game.player1Board;
            }

            var flag = false;
            for(var i = 0; i < board.length; i++) {
                var ship = board[i];
                for(var j = 0; j < ship.length; j++) {
                    var p = ship[j];
                    if(p.x === shot.x && p.y === shot.y) {
                        p.status = 'hit';
                        ship[j] = p;
                        flag = true;
                        break;
                    }
                }
                if(flag) {
                    if(_.find(ship, (p) => { return p.status !== 'hit'; }) === undefined) {
                        ship.status = 'sink';
                        board[i] = ship;
                        status = 'sink';
                        shot = ship;
                    } else {
                        status = 'hit';
                    }
                    break;
                }
            }

            if(_.find(board, (ship) => { return ship.status !== 'sink'; }) === undefined) {
                users[userId].send(JSON.stringify({ winner: 'you', packetName: 'endGame', gameId: game._id }));
                users[game.player1 === userId ? game.player2 : game.player1].send(JSON.stringify({ winner: 'opponent', packetName: 'endGame', gameId: game._id }));
                game.status = 'ended';
                delete activeGames[game._id];
                db.updateGame(game);
            } else {
                users[userId].send(JSON.stringify({ shot: shot, status: status, packetName: 'playerShot', gameId: game._id }));
                users[game.player1 === userId ? game.player2 : game.player1].send(JSON.stringify({ shot: shot, status: status, packetName: 'opponentShot', gameId: game._id }));
            }
    	} else {
    		ws.send(JSON.stringify({ msg: 'Unknown packet', status: 'warning'}));
    	}
    } else {
    	ws.send(JSON.stringify({ msg: 'No userId or packetName field in message json', status: 'warning'}));
    }
  });

  ws.on('error', (err) => {
    console.error(err);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  db.findGamesByStatus('waiting')
  .then((games) => {
    ws.send(JSON.stringify({ games: games, status: 'success', packetName: 'connect' }));
  });
});

wss.on('error', (err) => {
	console.error(err);
});

console.log('Server is running on port 80');