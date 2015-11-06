if( !process.env.PORTFOLIO_SESSION_SECRET || process.env.PORTFOLIO_SESSION_SECRET.length == 0) {
  console.error('No environment PORTFOLIO_SESSION_SECRET');
  process.exit(1);
}

var express        = require('express'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    expressLayouts = require('express-ejs-layouts'),
    i18n           = require("i18n"),
    path           = require('path'),
    session        = require('express-session'),
    passport       = require('passport'),
    CommonRoutes   = require('./routes/common');

// Connect to database
require('./config/passport')(passport); // pass passport for configuration

// i18n configuration
var locales = ['en', 'fr'].sort();
i18n.configure({
  locales: locales,
  defaultLocale: 'en',
  cookie: 'language',
  directory: path.join(__dirname, 'translations')
});

var app = express();

// Set up our express application
app.use(cookieParser());
app.use(i18n.init);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up ejs for templating
app.set('view engine', 'ejs');
app.set('layout', 'layout');

// Define some static locals
app.locals.routes = CommonRoutes.routes;
app.locals.page   = '';
app.locals.menus = [
  {
    name: 'projects',
    url: CommonRoutes.routes.projects,
    blank: false
  },
  {
    name: 'contact',
    url: CommonRoutes.routes.contact,
    blank: false
  },
  {
    name: 'cv',
    url: CommonRoutes.routes.cv,
    blank: false
  },
  {
    name: 'github',
    url: CommonRoutes.routes.github,
    blank: true
  },
];

// Required for passport
app.use(session({
  secret: process.env.PORTFOLIO_SESSION_SECRET,
  resave: true,
  saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Middleware to give values to views
app.use(function(req, res, next) {
  res.locals.languages = {
    current: i18n.getLocale(),
    locales: locales
  };

  res.locals.admin = req.isAuthenticated();

  next();
});

app.use(expressLayouts);

// Helpers
app.locals.capitalize = function(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

// Routes
require('./routes/projects.js')(app);
require('./routes/contact.js')(app);
require('./routes/cv.js')(app);
require('./routes/language.js')(app);
require('./routes/info.js')(app);
require('./routes/admin.js')(app, passport);

// Static files (JS, CSS, etc)
app.use(express.static(path.join(__dirname, 'public')));

// 404 error
app.get('*', function(req, res, next) {
  res.locals.title = req.__('error') + ' 404';
  res.status(404).render('404.ejs');
});

// Error handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.locals.title = req.__('error') + ' 500';
  res.status(500).render('500.ejs');
});

module.exports = app;
