var async = require("async");
const db = require('../db/dbConn');

const { body,validationResult } = require('express-validator');

exports.getInstitutions = function(req, res) {
    //res.send('NOT IMPLEMENTED: Site Home Page');
    async.parallel({
		userInstitutions: function(callback) {
        	var queryUserInstitutions = "SELECT DISTINCT(I.name) as name, I.id FROM assignments A INNER JOIN institutions I ON A.institution = I.id WHERE A.author = " + req.session.userId;
        	db.query(queryUserInstitutions, callback);
        },

        institutions: function(callback) {
        	var queryInstitutions = "SELECT * FROM institutions";
        	db.query(queryInstitutions, callback);
        }
    }, function(err, results) {
    	//console.log("User Sections: " + results.userSections.length);
    	//console.log("User Sections1: " + JSON.stringify(results.userSections));
        if (err) { return next(err); }
        /*if (results.userSections==undefined) { // No results.
        	console.log("AAA");
			results.userSections = [];
        }
        */
        // Successful, so render
        //res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
	    res.render('getInstitution', { title: 'Welcome ' + req.session.name, institutions: results.institutions.rows, userInstitutions: results.userInstitutions.rows });
    });
};

exports.formInstitution = function (req, res) {
    res.render('institution', { title: 'Welcome ' + req.session.name});
};

exports.createInstitution = [
    // Validate fields.
    body('name', 'The institution name must not be empty.').trim().isLength({ min: 1 }),

    function(req, res) {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log("Body: " + JSON.stringify(req.body));
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('institution', { title: 'Welcome ' + req.session.name, institutions: [], userInstitutions: [], errors: errors.array()});
            return;
        } else {
            var queryInstitutions = "INSERT INTO institutions (name) VALUES ('" + req.body.name + "')";
            db.query(queryInstitutions,  function(err, results) {
                if (err) throw err;
                res.redirect('/home');
                //response.end();
            });
        }
    }
];

