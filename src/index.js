const express = require('express');
const morgan = require('morgan');
const template = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');

// Initialization
const app = express();
require('./lib/passport');

// Setting
app.set('port', process.env.Port || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', template({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'booksmysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/books', require('./routes/books'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Error 400
app.use(function (req, res) {
    res.status(400);
    res.render('error', {title: '404: File Not Found'});

});

// Error 500
app.use(function (error, req, res, next) {
    res.status(500);
    res.render('error', {title: '500: Internal Server Error'});
});

// Listening server
app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
});