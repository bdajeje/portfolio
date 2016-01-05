"use strict";

// Project constructor
module.exports = function(sequelize, DataTypes) {
  var ProjectText = sequelize.define("project_text", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        ProjectText.belongsTo(models.project);
      }
    },
    timestamps: false
  });

  return ProjectText;
};
