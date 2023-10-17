const Users = require('../models/users');

const getUsers = async (req, res) => {
    try{
        const Users = await Users.findAll();
        res.json(Users);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed retrieval of all users',
            error: error.message
        });
    }
};

const getOneUser = async (req, res) => {
    const Users = await Users.findOne({
        attributes: ["email", "name", "surname"]
    });
    return Users;
};

const validateUsers = (req, res) => {

}

const insertUsers = (req, res, next) => {

}

exports.getUsers = getUsers;