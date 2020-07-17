const createError  = require('http-errors');
const express      = require('express');
const partials     = require('express-partials');

const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');

const mongoose     = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const flash    = require('connect-flash');
const session  = require('express-session');
const passport = require('passport');

const app = express();

// Passport from config
require('./config/passport')(passport)

// Mongo DB
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true}).then(() => console.log('MongoDB connected...')).catch(err => console.log(err));

// view engine setup
app.use(partials());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Body parser
app.use(express.urlencoded( {extended:false} ));

// Express session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
	// cookie: {secure: true}
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// flash
app.use( flash() );

// Global variables
app.use( (req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg   = req.flash('error_msg');
	res.locals.error       = req.flash('error');
	next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;