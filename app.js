var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

app = express();

app.use(bodyParser());
app.use(session({secret: 'ezSQL and ezAuth'}));
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var server = app.listen(3000, function() {
	console.log('Server is running on port 3000.');
});

var userController = require('./controllers/userController');

app.get('/', userController.index);

app.get('/signin', userController.getSignin);
app.post('/signin', userController.postSignin);
app.get('/signout', userController.getSignout);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/me/edit', userController.getEditFullname);
app.post('/me/edit', userController.postEditFullname);
app.get('/me/remove', userController.getRemoveMe);