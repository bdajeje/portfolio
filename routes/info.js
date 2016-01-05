var common = require('./common');

module.exports = function(app) {

  app.get(common.routes.info, function(req, res) {
    var info = {
      email: 'jeremy.gousse@gmail.com',
      phone: '514-561-8728'
    }

    res.end(info[req.params.value]);
  });

}
