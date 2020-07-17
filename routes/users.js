var express    = require('express');
var router     = express.Router();

const bcrypt   = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User')

/* GET users listing. */
router.get(
	       '/', (req, res, next) => res.render('', { title: 'Kiemhiep' })
	      );


// Login page
router.get(
	       '/login', (req, res) => res.render('login')
	      );

// Login page
router.get(
	       '/register', (req, res) => res.render('register')
	      );

// Register Handle

// router.post('/register', (req, res) => {
// 	console.log(req.body)
// 	res.send('Hello!')
// });

router.post('/register', (req, res) => {
	const {name, email, password, password2 } = req.body;
	let errors = []

	// Check required fields
	if( !name || !email || !password || !password2) {
		errors.push({msg: 'Please fill in all fields'})
	}

	// Check passwords match
	if(password != password2) {
		errors.push({msg: 'Passwords do not match'})
	}

	// Check pass length
	if(password.length < 3){
		errors.push({msg: 'Password should be at least 6 characters'})
	}

	if(errors.length > 0){
		res.render('register', {errors, name, email, password, password2})
	} else {
		// Validation
		User.findOne({email:email})
			.then( user => {
				if(user) {
					// User exists
					errors.push({msg: 'Email is already registered'});
					res.render('register', {errors, name, email, password, password2});
				} else {
					const newUser = new User({
						name,
						email,
						password
					});
					
					// Hash password
					bcrypt.genSalt(
						10,
						(err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
							if(err) throw err;

							// Set password to hash
							newUser.password = hash;
							newUser.save()
								.then(user => {
									req.flash('success_msg', 'Registered succesfully, please login');
									res.redirect('/users/login');
								})
								.catch( err => console.log(err) )
						})
					)
				}
			} );
	};
});

// Login handle
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});


// Logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'Logged out')
	res.redirect('/users/login')
});

module.exports = router;
