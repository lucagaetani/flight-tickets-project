const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");

const Users = instanceSequelize.define(
  "Users",
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//If uncommented, it synchronizes the database with Sequelize
//Users.sync({force: true});
module.exports = Users;
