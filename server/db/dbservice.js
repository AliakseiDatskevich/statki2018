var nedb = require('nedb');
var promise = require('promise');

var db = {};
db.users = new nedb({ filename: './db/users.db', autoload: true });
db.games = new nedb({ filename: './db/games.db', autoload: true });

module.exports = {
	registerUser: (user) => {
		return new Promise((resolve, reject) => {
			db.users.insert(user, (err, newUser) => {
				if(err) {
					reject();
				} else {
					resolve(newUser);
				}
			});			
		});	
	},
	findUserByUsername: (username) => {
		return new Promise((resolve, reject) => {
			db.users.find({ username: username }, (err, user) => {
				if(err) {
					reject();
				} else {
					resolve(user);
				}
			});
		});
	},
	findUserById: (id) => {
		return new Promise((resolve, reject) => {
			db.users.find({ _id: id }, (err, user) => {
				if(err) {
					reject();
				} else {
					resolve(user);
				}
			});
		});
	},
	findAllGames: () => {
		return new Promise((resolve, reject) => {
			db.games.find({}, (err, games) => {
				if(err) {
					reject();
				} else {
					resolve(games);
				}
			});
		});
	},
	createGame: (game) => {
		return new Promise((resolve, reject) => {
			db.games.insert(game, (err, newGame) => {
				if(err) {
					reject();
				} else {
					resolve(newGame);
				}
			});
		});
	},
	updateGame: (game) => {
		return new Promise((resolve, reject) => {
			db.games.update({ _id: game._id}, game, {}, (err, numReplaced) => {
				if(err) {
					reject();
				} else {
					if(numReplaced === 1) {
						resolve(game);	
					} else {
						reject();
					}
				}
			});
		});
	},
	findGameById: (id) => {
		return new Promise((resolve, reject) => {
			db.games.find({ _id: id }, (err, games) => {
				if(err) {
					reject();
				} else {
					resolve(games.length > 0 ? games[0] : {});
				}
			});
		});
	},
	findGamesByStatus: (status) => {
		return new Promise((resolve, reject) => {
			db.games.find({ status: status }, (err, games) => {
				if(err) {
					reject();
				} else {
					resolve(games);
				}
			});
		});
	}
};