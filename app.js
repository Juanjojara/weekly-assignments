const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;
const { Pool } = require('pg');

const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(session({
	secret: process.env.WA_SECRET,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	//client.connect();
	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		var loginQuery = "SELECT * FROM users WHERE email = '" + email + "' AND password = crypt('" + password + "', password);";
		//console.log(loginQuery);
		pool.query(loginQuery, (err, res) => {
			if (err) throw err;
			if (res.rows.length > 0) {
				request.session.loggedin = true;
				request.session.username = email;
				//pool.end();
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
				response.end();
				//pool.end();
			}
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

app.post('/register', function(request, response) {
	//client.connect();
	var name = request.body.name;
	var email = request.body.email;
	var password = request.body.password;

	var loginQuery = "INSERT INTO users (name, email, password) VALUES ('" + name + "', '" + email + "', crypt('" + password + "', gen_salt('bf')));";
	//console.log(loginQuery);
	pool.query(loginQuery, (err, res) => {
		if (err) throw err;
		response.redirect('/home');
		//response.end();
	});
});


app.get('/home', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));