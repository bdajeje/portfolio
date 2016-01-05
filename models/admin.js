"use strict";

// Admin constructor
module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define("admin", {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return Admin;
};
