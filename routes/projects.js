var routes      = require('./common').routes,
    fs          = require('fs'),
    path        = require('path'),
    i18n        = require("i18n"),
    models      = require('../models/index'),
    Project     = models.project,
    ProjectText = models.project_text;

module.exports = function(app) {

  app.get(['/', routes.projects, routes.project], function(req, res, next) {
    res.locals.page = 'projects';
    next();
  });

  app.get(['/', routes.projects], function(req, res) {
    Project.findAll({
      attributes: ['name', 'type'],
      include: [{
        model: ProjectText,
        attributes: ['text'],
        where: {language: i18n.getLocale()}
      }]
    }).then(function(projects) {
      res.render('projects.ejs', {projects: projects});
    });
  });

  app.get(routes.project, function(req, res) {
    Project.find({
      where: {name: req.params['name'].replace(/-/g, ' ')},
      include: [{
        model: ProjectText,
        attributes: ['text'],
        where: {language: i18n.getLocale()}
      }]
    }).then(function(project) {
      res.render('project.ejs', {project: project, title: project.name});
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
