var db = require('../ezSQL');
var auth = require('../ezAuth');
var bcrypt = require('bcrypt-nodejs');

module.exports.index = function(req, res) {
	if(auth.isLogin(req)) {
		res.render('index', {user: auth.user(req)});
	}
	else {
		res.redirect('/signin');
	}
};

module.exports.getSignin = function(req, res) {
	if(auth.isLogin(req)) {
		res.redirect('/');
	}
	else {
		res.render('user/signin');
	}
};

module.exports.postSignin = function(req, res) {
	var data = {
		username: req.body.username,
		password: req.body.password
	};

	auth.login(req, data, function(user){
		if(user) res.redirect('/');
		else res.render('user/signin', {message: 'USER NOT FOUND!'});
	});
};

module.exports.getSignout = function(req, res) {
	auth.logout(req);
	res.redirect('/signin');
};

module.exports.getSignup = function(req, res) {
	if(auth.isLogin(req)) {
		res.redirect('/');
	}
	else {
		res.render('user/signup');
	}
};

module.exports.postSignup = function(req, res) {
	var data = {
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password),
		fullname: req.body.fullname
	};

	db.get('users', 'username = "' + data.username + '"', function(rows) {
		if(typeof(rows[0]) === 'undefined') {
			db.insert('users', data, function(user_id) {
				auth.login(req, req.body, function(user) {
					res.redirect('/');
				});
			});
		}
		else {
			res.render('user/signup', {message: 'USERNAME HAS BEEN USED!'});
		}
	});
};

module.exports.getEditFullname = function(req, res) {
	if(!auth.isLogin(req)) {
		res.redirect('/signin');
	}
	else {
		res.render('user/edit', {user: auth.user(req)});
	}
};

module.exports.postEditFullname = function(req, res) {
	db.update('users', 'fullname = "' + req.body.fullname + '"', 'id = ' + auth.user(req).id, function(data) {
		auth.update(req, function(user) {
			res.redirect('/');
		});
	});
};

module.exports.getRemoveMe = function(req, res) {
	if(!auth.isLogin(req)) {
		res.redirect('/signin');
	}
	else {
		db.remove('users', 'id = ' + auth.user(req).id, function(data) {
			auth.logout(req);
			res.redirect('/signin');
		});
	}
};