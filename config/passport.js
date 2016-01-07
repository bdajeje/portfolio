var LocalStrategy = require('passport-local').Strategy,
    Bcrypt        = require('bcrypt-nodejs'),
    models        = require('../models/index'),
    Admin         = models.admin;

// expose this function to our app using module.exports
module.exports = function(passport) {
  passport.serializeUser(function(admin, done) {
    done(null, admin);
  });

  passport.deserializeUser(function(admin, done) {
    done(null, admin);
  });

  passport.use( 'local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      Admin.find({
        where: { username: username },
        attributes: ['password']
      }).then(function(admin) {
        // No admin found
        if(!admin)
          return done(null, false);

        // Wrong password
        if(!Bcrypt.compareSync(password, admin.password))
          return done(null, false);

        // All good
        return done(null, admin);
      });
    })
  );
};
