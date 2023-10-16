const { DataTypes } = require("sequelize");
const instanceSequelize = require("../database");

const Users = instanceSequelize.define(('Users'), {
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

//Users.sync({force: true});
module.exports = Users;