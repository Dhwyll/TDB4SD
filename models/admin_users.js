'use strict';

module.exports = function(sequelize, DataTypes) {
  const AdminUser = sequelize.define('Admin_User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Admin_Users',
    timestamps: false
  });

  return AdminUser;
};
