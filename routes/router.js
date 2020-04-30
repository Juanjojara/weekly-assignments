var express = require('express');
var router = express.Router();
//const path = require('path');
// Require controller modules.
var assignments_controller = require('../controllers/assignmentsController');
var auth_controller = require('../controllers/authController');
var institutions_controller = require('../controllers/institutionsController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', function(request, response) {
	if (request.session.loggedin){
		response.redirect('/getInstitution');
	}else{
		response.redirect('/login');
	}
});

router.get('/home', function(request, response) {
	if (request.session.loggedin){
		//console.log("Body: " + JSON.stringify(request.params));
		request.session.institutionID = request.query.institution;
		response.redirect('/home/' + request.query.institution);
	}else{
		response.redirect('/login');
	}
});

router.get('/home/:institutionId', function(request, response) {
	if (request.session.loggedin){
		assignments_controller.index(request, response);
	}else{
		response.redirect('/login');
	}
});

router.get('/login', auth_controller.login);
router.post('/auth', auth_controller.auth);
router.get('/register', auth_controller.register);
router.post('/register', auth_controller.create_user);
router.get('/getInstitution', institutions_controller.getInstitutions);
router.get('/institution', institutions_controller.formInstitution);
router.post('/institution', institutions_controller.createInstitution);
router.post('/assignment', assignments_controller.createAssignment);


module.exports = router;