var createError = require('http-errors');
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);




var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt');
const saltRounds = 10;

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');

var modifycRouter = require('./routes/modifyc');

//Receptionist Routes.
var newuserRouter = require('./routes/newuser');
var viewcRouter = require('./routes/viewc');
//var addcRouter = require('./routes/addc');
var attlogRouter = require(('./routes/attlog'));

//Maintenance Routes

var addiRouter = require('./routes/addi');
var modifyiRouter = require('./routes/modifyi');
var viewiRouter = require('./routes/viewi');

//Customer 

var addtRouter = require('./routes/addt');
var viewtRouter = require('./routes/viewt');

//Manager

var newempRouter = require('./routes/newemp');
var modifyeRouter = require('./routes/modifye');
var statsRouter = require('./routes/stats');

var app = express();

//app.locals.points = "8,912";

var user ;

var type;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser());

var options = {
    host: 'localhost',
    user: 'root',
    password : 'Keyshore',
    database: 'fitness'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'ncaasd',
  resave: false,
  store: sessionStore,
  saveUninitialized: false
  //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.isAuthenticated = req.isAuthenticated();

	if(req.isAuthenticated())
	res.locals.type = req.user.type;
	next();
});

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/about', aboutRouter);


app.use('/modifyc', modifycRouter);

//receptionist
//app.use('/addc', addcRouter);
app.use('/viewc', viewcRouter);
app.use('/attlog', attlogRouter);
app.use('/newuser', newuserRouter);
//app.use('/signin', signinRouter);

//Maintenance

app.use('/addi', addiRouter);
app.use('/modifyi', modifyiRouter);
app.use('/viewi', viewiRouter);

//Customer

app.use('/addt', addtRouter);
app.use('/viewt', viewtRouter);

//Manager
app.use('/newemp', newempRouter);
app.use('/modifye', modifyeRouter);
app.use('/stats', statsRouter);

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

function authenticationMiddleware() {  
    return (req, res, next) => {
        //console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()){

			res.locals.type = req.user.type;
        	return next();
        } 
        // if(req.route=='/signin') return next();
        
        // if(req.route!='/signin')
        res.redirect('/signin');
    }
}



module.exports = app;
