const path = require('path');
const db = require('../db/dbConn');

exports.login = function(request, response) {
	response.sendFile(path.join(__dirname + '/../login.html'));		
};

exports.auth = function(request, response) {
	//client.connect();
	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		var loginQuery = "SELECT * FROM users WHERE email = '" + email + "' AND password = crypt('" + password + "', password);";
		//console.log(loginQuery);
		db.query(loginQuery, (err, res) => {
		//pool.query(loginQuery, (err, res) => {
			if (err) throw err;
			if (res.rows.length > 0) {

				request.session.loggedin = true;
				request.session.username = email;
				request.session.name = res.rows[0].name;
				request.session.userId = res.rows[0].id;
				//pool.end();
				response.redirect('/getInstitution');
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
};

exports.register =  function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
};

exports.create_user = function(request, response) {
	//client.connect();
	var name = request.body.name;
	var email = request.body.email;
	var password = request.body.password;

	var loginQuery = "INSERT INTO users (name, email, password) VALUES ('" + name + "', '" + email + "', crypt('" + password + "', gen_salt('bf')));";
	//console.log(loginQuery);
	db.query(loginQuery, (err, res) => {
		if (err) throw err;
		response.redirect('/home');
		//response.end();
	});
};
