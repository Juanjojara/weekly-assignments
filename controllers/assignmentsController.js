var async = require("async");
const db = require('../db/dbConn');
const { body,validationResult } = require('express-validator');

exports.index = function(req, res) {
    async.parallel({
		userAssignments: function(callback) {
        	var queryAssignments = "SELECT * FROM assignments WHERE author = " + req.session.userId;
        	db.query(queryAssignments, callback);
        },

		userSections: function(callback) {
        	var queryAssignments = "SELECT DISTINCT(classroom_group) as section FROM assignments WHERE author = " + req.session.userId;
        	db.query(queryAssignments, callback);
        },

        institutions: function(callback) {
        	var queryAssignments = "SELECT * FROM institutions WHERE id = " + req.session.institutionID;
        	db.query(queryAssignments, callback);
        },

        assignments: function(callback) {
        	var queryAssignments = "SELECT * FROM assignments WHERE institution = " + req.session.institutionID;
        	db.query(queryAssignments, callback);
        }

    }, function(err, results) {
    	//console.log("Inst: " + req.session.institutionID);
    	console.log("User Sections: " + results.userSections.rows.length);
    	//console.log("User Sections1: " + JSON.stringify(results.userSections));
        if (err) { return next(err); }
        /*if (results.userSections==undefined) { // No results.
        	console.log("AAA");
			results.userSections = [];
        }
        */
        // Successful, so render
        //res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
	    res.render('index', { title: 'Assignments for ' + results.institutions.rows[0].name, assignmentsMonday: results.assignments.rows, userAssignments: results.userAssignments.rows, classrooms: results.userSections.rows });
    });
};

exports.createAssignment = [
    // Validate fields.
    body('section', 'The section must not be empty.').trim().isLength({ min: 1 }),
    body('subject', 'The subject must not be empty.').trim().isLength({ min: 1 }),
    body('assignment', 'The assignment must not be empty.').trim().isLength({ min: 1 }),
    body('duration', 'The duration must be minimum 5 minutes and maximum 240 minutes (4 hours).').isNumeric({ min: 5, max: 240}),

    function(req, res) {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log("Body: " + JSON.stringify(req.body));
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            async.parallel({
				userAssignments: function(callback) {
		        	var queryAssignments = "SELECT * FROM assignments WHERE author = " + req.session.userId;
		        	db.query(queryAssignments, callback);
		        },

				userSections: function(callback) {
		        	var queryAssignments = "SELECT DISTINCT(classroom_group) as section FROM assignments WHERE author = " + req.session.userId;
		        	db.query(queryAssignments, callback);
		        },

		        institutions: function(callback) {
		        	var queryAssignments = "SELECT * FROM institutions WHERE id = " + req.session.institutionID;
		        	db.query(queryAssignments, callback);
		        },

		        assignments: function(callback) {
		        	var queryAssignments = "SELECT * FROM assignments WHERE institution = " + req.session.institutionID;
		        	db.query(queryAssignments, callback);
		        }

		    }, function(err, results) {
		    	console.log("Inst: " + req.session.institutionID);
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
			    res.render('index', { title: 'Assignments for ' + results.institutions.rows[0].name, assignments: results.assignments.rows, userAssignments: results.userAssignments.rows, classrooms: results.userSections.rows, errors: errors.array() });
				return;
		    });
        } else {
            var queryInstitutions = "INSERT INTO assignments " + 
            						"(institution, classroom_group, subject, assignment, duration, assignment_date, creation_date, author) VALUES " + 
            						"(" + req.session.institutionID + ", '" + req.body.section + "', '" + req.body.subject + "', '" + req.body.assignment + 
            						"', " + req.body.duration + ", '" + req.body.date_of_assignment+ "', now(), " + req.session.userId + ")";
            console.log("Insert Assignments: " + queryInstitutions);
            db.query(queryInstitutions,  function(err, results) {
                if (err) throw err;
                res.redirect('/home/' + req.session.institutionID);
                //response.end();
            });
        }
    }
];