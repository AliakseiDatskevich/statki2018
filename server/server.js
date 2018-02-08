var express = require('express');
var bodyParser = require('body-parser');
var promise = require('promise');
var _ = require('lodash');

var db = require('./db/dbservice.js');

var app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.post('/user/register', (req, res) => {
	res.type('json');
	var user = req.body.user;

	if(user) {
		if(user.username) {
			if(user.password) {
				db.findUserByUsername(user.username)
				.then((users) => {
					if(users.length === 0) {
						db.registerUser(user)
						.then((newUser) => {
							res.send({ status: 'success', userId: newUser._id });
						});
					} else {
						res.send({ status: 'warning', info: 'User with specified username already exists.' });
					}
				});
			} else {
				res.send({ status: 'warning', info: 'No password field in user object.' });
			}
		} else {
			res.send({ status: 'warning', info: 'No username field in user object.' });
		}
	} else {
		res.send({ status: 'warning', info: 'No user object in request body.' });
	}
});

app.post('/user/login', (req, res) => {
	res.type('json');
	var user = req.body.user;

	if(user) {
		if(user.username) {
			if(user.password) {
				db.findUserByUsername(user.username)
				.then((users) => {
					if(users.length > 0) {
						var userFromDb = users[0];
						if(user.password === userFromDb.password) {
							res.send({ status: 'success', userId: userFromDb._id });
						} else {
							res.send({ status: 'warning', info: 'Incorrect password.' });
						}
					} else {
						res.send({ status: 'warning', info: 'No user with specified username.' });
					}
				});
			} else {
				res.send({ status: 'warning', info: 'No password field in user object.' });
			}
		} else {
			res.send({ status: 'warning', info: 'No username field in user object.' });
		}
	} else {
		res.send({ status: 'warning', info: 'No user object in request body.' });
	}
});

app.listen(PORT, () => console.log('Server is listening on port', PORT));
