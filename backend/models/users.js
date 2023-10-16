const { Sequelize, DataTypes } = require("sequelize");

const Users = Sequelize.define(('Users'), {
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: DataTypes.STRING,
    surname: DataTypes.STRING
}, {
    freezeTableName: true,
    timestamps: false
});

Users.sync({ match: /blvwowqpyu8y5eemtign/ });
module.exports = Users;