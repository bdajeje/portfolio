var routes      = require('./common').routes,
    fs          = require('fs'),
    path        = require('path'),
    i18n        = require("i18n"),
    models      = require('../models/index'),
    Async       = require('async'),
    Project     = models.project,
    ProjectText = models.project_text;

module.exports = function(app) {

  app.get(['/', routes.projects, routes.project], function(req, res, next) {
    res.locals.page = 'projects';
    next();
  });

  app.get(['/', routes.projects], function(req, res) {
    Project.findAll({
      attributes: ['name', 'type']
    }).then(function(projects) {
      res.render('projects.ejs', {projects: projects});
    });
  });

  app.get(routes.project, function(req, res) {
    // Find wanted project
    Project.find({
      where: {name: req.params['name'].replace(/-/g, ' ')},
      include: [{
        model: ProjectText,
        attributes: ['text'],
        where: {language: i18n.getLocale()}
      }]
    }).then(function(found_project) {
      // Project found, now let's find previous/next projets
      // Note: launch both queries in parallel
      Async.parallel([
        // Find previous project
        function(callback) {
          Project.find({
            where: {id: (found_project.id - 1)},
            attributes: ['name']
          }).then(function(previous_project) {
            callback(null, previous_project);
          });
        },
        // Find next project
        function(callback) {
          Project.find({
            where: {id: (found_project.id + 1)},
            attributes: ['name']
          }).then(function(next_project) {
            callback(null, next_project);
          });
        },
      ], function(err, results) {
        // Render
        res.render('project.ejs', {
          title: found_project.name,
          project: found_project,
          previous_project: results[0],
          next_project: results[1]
        });
      });
    });
  });

  app.get(routes.project_info, function(req, res) {
    var project_id = req.params.id;
    Project.find({
      where: {id: project_id},
      attributes: ['name', 'type', 'video_url', 'github'],
      include: [{
        model: ProjectText,
        attributes: ['language', 'text']
      }]
    }).then(function(project) {
      res.json({
        name: project.name,
        type: project.type,
        description: project.description,
        video_url: project.video_url,
        github: project.github,
        texts: project.project_texts
      });
    });
  });
}
