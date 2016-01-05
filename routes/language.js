var common = require('./common'),
    url    = require('url'),
    i18n   = require('i18n');

module.exports = function(app) {

  app.get(common.routes.language, function(req, res) {
    // Set language cookie
    res.cookie('language', req.params.lang);
    i18n.setLocale(req.params.lang);

    // Redirect user to previous page
    var last_url = url.parse(req.header('Referer')).pathname;
    res.redirect(last_url);
  });

}
