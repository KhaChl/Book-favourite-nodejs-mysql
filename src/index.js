const express = require('express');
const morgan = require('morgan');
const template = require('express-handlebars');
const path = require('path');

// Initialization
const app = express();

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
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global variables
app.use((req,resp,next)=>{
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/books',require('./routes/books'));


// Public
app.use(express.static(path.join(__dirname, 'public')));

// Listening server
app.listen(app.get('port'), ()=>{
    console.log('Server on port:', app.get('port'));
});