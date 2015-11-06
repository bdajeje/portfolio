var common = require('./common'),
    path   = require('path');

module.exports = function(app) {

  app.get(common.routes.cv, function(req, res) {
    var file = path.join(__dirname, '../public/downloadables/CV.pdf');
    res.download(file);
  });

}
