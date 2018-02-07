const WebSocket = require('ws');

var db = require('./db/dbservice.js');

const wss = new WebSocket.Server({ port: 80 });

const BOARD_DIMENSION = 10;
var users = {};
var activeGames = {};
 
wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);

    var userId = msg.userId;
    var action = msg.packetName;

    if(userId && action) {
    	if(action === 'create') {
    		db.createGame({ player1: userId})
    		.then((game) => {
    			users[userId] = ws;
    			ws.send(JSON.stringify({ status: 'created', gameId: game._id }));
    		});
    	} else if(action === 'join') {
    		db.findGameById(msg.gameId)
    		.then((game) => {
    			game.player2 = userId;
    			game.player1Status = 'notready';
    			game.player2Status = 'notready';
    			db.updateGame(game)
    			.then((game) => {
    				activeGames[game._id] = game;

    				users[userId] = ws;
    				ws.send(JSON.stringify({ status: 'starting', gameId: game._id }));
    				users[game.player1].send(JSON.stringify({ status: 'starting', gameId: game._id }));
    			});
    		});
    	} else if(action === 'playerBoard') {
    		var game = activeGames[msg.gameId];
    		var playerBoard = msg.board;

    		if(game.player1 === userId) {
    			game.player1Board = playerBoard;
    			game.player1Status = 'ready';
    		} else if(game.player2 === userId) {
    			game.player2Board = playerBoard;
    			game.player2Status = 'ready';
    		}

				// update games db

    		if(game.player1Status === 'ready' && game.player2Status === 'ready') {
    			users[game.player1].send(JSON.stringify({ status: 'started', gameId: game._id }));
    			users[game.player2].send(JSON.stringify({ status: 'started', gameId: game._id }));
    		}
    	} else if(action === 'playerShot') {

    	} else {
    		ws.send(JSON.stringify({ msg: 'Unknown packet', status: 'warning'}));
    	}
    } else {
    	ws.send(JSON.stringify({ msg: 'No userId or packetName field in message json', status: 'warning'}));
    }
  });
  ws.send(JSON.stringify({ msg: 'You are connected to WebSocket server', status: 'success' }));
});

wss.on('error', (err) => {
	console.error(err);
});

var initBoard = () => {
	var board = [];
	for(var i = 0; i < BOARD_DIMENSION; i++) {
		board.push([]);
		for(var j = 0; j < BOARD_DIMENSION; j++) {
			board[i].push(0);
		}
	}
	return board;
};