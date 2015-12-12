// ezSQL

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'caca1212',
	database: 'nodeDB'
});

connection.connect();

var insert = function(table, data, callback) {
	connection.query('INSERT INTO ' + table + ' SET ?', data, function(err, result) {
		if(err) throw err;
		callback(result.insertId);
	});
};

var find = function(table, id, callback) {
	connection.query('SELECT * FROM ' + table + ' WHERE ?', {id: id}, function(err, rows) {
		if(err) throw err;
		callback(rows[0]);
	});
};

var get = function(table, where, callback) {
	connection.query('SELECT * FROM ' + table + ' WHERE ' + where, function(err, rows) {
		if(err) throw err;
		callback(rows);
	});
};

var remove = function(table, where, callback) {
	connection.query('DELETE FROM ' + table + ' WHERE ' + where, function(err, result) {
		if(err) throw err;
		callback(result.affectedRows);
	});
};

var update = function(table, data, where, callback) {
	connection.query('UPDATE ' + table + ' SET ' + data + ' WHERE ' + where, function(err, result) {
		if(err) throw err;
		callback(result.changedRows);
	});
};

module.exports.insert = insert;
module.exports.find = find;
module.exports.get = get;
module.exports.remove = remove;
module.exports.update = update;