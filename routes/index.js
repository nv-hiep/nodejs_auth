const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../config/auth');

/* GET home page. */
router.get(
	       '/', (req, res, next) => res.render('welcome', { title: 'Express' })
	      );

/* GET dashboard page. */
router.get(
	       '/dashboard', ensureAuthenticated, (req, res, next) => 
	       res.render('dashboard', { username: req.user.name })
	      );

module.exports = router;
