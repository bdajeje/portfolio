var routes      = require('./common').routes,
    models      = require('../models/index'),
    i18n        = require("i18n"),
    Project     = models.project,
    ProjectText = models.project_text;
    multer      = require('multer'),
    upload      = multer({ dest: '/tmp' }),
    fs          = require('fs');

function iconPath(name) {
  return 'public/images/projects/' + name + ".png";
}

function saveIcon(current_path, name) {
  fs.rename(current_path, iconPath(name));
}

module.exports = function(app, passport) {

  // Authentication is needed for admin routes (expect login page '/admin')
  app.all(routes.admin.secured_pages, function(req, res, next) {
    if(req.isAuthenticated())
      return next();

    res.redirect(routes.admin.authentication);
  });

  // Login action
  app.post(routes.admin.login, passport.authenticate('local-login', {
    successRedirect : routes.admin.dashboard,
    failureRedirect : routes.admin.authentication
  }));

  // See login page
  app.get(routes.admin.authentication, function(req, res) {
    res.render('admin/login.ejs');
  });

  // See dashboard
  app.get(routes.admin.dashboard, function(req, res) {
    Project.findAll({
      order: 'name',
      attributes: ['id', 'name'],
      include: [ProjectText]
    }).then(function(projects) {
      Project.allTypes(function(types) {
        res.render('admin/dashboard.ejs', {projects: projects, types: types});
      });
    });
  });

  // Logout
  app.get(routes.admin.logout, function(req, res) {
    req.logout();
    res.redirect(routes.home);
  });

  // New project
  app.post(routes.admin.new_project, upload.single('icon'), function(req, res) {
    var name      = req.body.name,
        video_url = req.body.video_url,
        type      = req.body.type,
        github    = req.body.github;

    Project.build({
      name: name,
      video_url: video_url,
      type: type,
      github: github
    }).save().success(function(project) {
      // Now save project texts
      res.locals.languages.locales.forEach(function(language) {
        ProjectText.build({
          language: language,
          text: req.body['description-' + language],
          projectId: project.id
        }).save();
      });

      // Project saved succesfully in DB so accept file upload
      saveIcon(req.file.path, name);
    });

    res.redirect(routes.admin.dashboard);
  });

  // Edit project
  app.post(routes.admin.edit_project, upload.single('icon'), function(req, res) {
    var id        = req.body.id,
        name      = req.body.name,
        video_url = req.body.video_url,
        type      = req.body.type,
        github    = req.body.github;

    Project.find({
      where: {id: id},
      include: [ProjectText]
    }).then(function(project) {
      if(project) {
        var old_name = project.name;

        project.name      = name;
        project.video_url = video_url;
        project.type      = type;
        project.github    = github;
        project.save().success(function() {
          // Now save project texts
          project.project_texts.forEach(function(project_text) {
            project_text.text = req.body['description-' + project_text.language];
            project_text.save();
          });

          // Project updated succesfully in DB so accept file upload
          if(req.file)
            saveIcon(req.file.path, name);
          else if(old_name != project.name) {
            // No new file but new name, so update icon file name
            saveIcon(iconPath(old_name), name);
          }
        });
      }

      res.redirect(routes.admin.dashboard);
    });
  });

  // Delete project
  app.post(routes.admin.delete_project, function(req, res) {
    Project.find({
      where: {id: req.body.id},
      attributes: ['id', 'name']
    }).then(function(project) {
      if(project) {
        project.destroy().success(function() {
          // Project is deleted so remove its icon
          var path = iconPath(project.name);
          fs.stat(path, function(err, stats) {
            if(!err && stats.isFile())
              fs.unlink(path);
          });

          // Remove project texts
          ProjectText.destroy({
            where: {projectId: project.id}
          });
        });
      }

      res.redirect(routes.admin.dashboard);
    });
  });
}
