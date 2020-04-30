const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;
const { Pool } = require('pg');

const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

var indexRouter = require('./routes/router');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: process.env.WA_SECRET,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/', indexRouter);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));