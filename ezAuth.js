// ezAuth via ezSQL

var bcrypt = require('bcrypt-nodejs');

var ezSQL = require('./ezSQL');

var sess;

var isLogin = function(req) {
	sess = req.session;
	if(sess.user) {
		ezSQL.find('users', sess.user.id, function(user) {
			sess.user = user;
			delete sess.user.password;
		});
		return true;
	}
	else return false;
};

var login = function(req, data, callback) {
	ezSQL.get('users', '`username` = "' + data.username + '"', function(user) {
		if(typeof(user[0]) !== 'undefined') {
			if(bcrypt.compareSync(data.password, user[0].password)) {
				sess = req.session;
				sess.user = user[0];
				delete sess.user.password;
				callback(user[0]);
			}
			else callback(undefined);
		}
		else callback(undefined);
	});
};

var user = function(req) {
	return req.session.user;
};

var update = function(req, callback) {
	if(isLogin(req)) {
		sess = req.session;
		ezSQL.find('users', sess.user.id, function(user) {
			sess.user = user;
			delete sess.user.password;
			callback(user);
		});
	}
	else {
		return callback(undefined);
	}
}

var logout = function(req) {
	sess = req.session;
	if(isLogin(req)) delete sess.user;
};

module.exports.isLogin = isLogin;
module.exports.login = login;
module.exports.logout = logout;
module.exports.user = user;
module.exports.update = update;