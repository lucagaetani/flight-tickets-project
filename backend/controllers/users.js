const Users = require('../models/users');

const getUsers = (req, res, next) => {
    const Users = Users.findOne({
        attributes: ["email", "name", "surname"]
    });
    return Users;
};

const validateUsers = (req, res) => {

}

const insertUsers = (req, res, next) => {
    
}

module.exports = {getUsers};