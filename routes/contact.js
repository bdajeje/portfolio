var common = require('./common');

module.exports = function(app) {

  app.get(common.routes.contact, function(req, res) {
    res.locals.page = 'contact';
    res.render('contact.ejs', {title: req.__('contact')});
  });

}
