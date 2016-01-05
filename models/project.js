"use strict";

// Project constructor
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define("project", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    github: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    instanceMethods: {
      urlName: function() {
        return this.name.replace(/\s/g, '-');
      }
    },
    classMethods: {
      associate: function(models) {
        Project.hasMany(models.project_text, {
          onDelete: 'RESTRICT',
          foreignKey: {
            allowNull: false
          }
        });
      },
      allTypes: function(callback) {
        sequelize.query("SELECT DISTINCT type FROM projects").success(function(rows) {
          var types = [];
          rows.forEach(function(row) {
            types.push( row.type );
          });
          callback(types);
        });
      }
    },
    timestamps: false
  });

  return Project;
};
