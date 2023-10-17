const Users = require('../models/users');

const validateUsers = (req, res) => {

}

const registerUser = async (req, res, next) => {
    const { email, password, name, surname } = req.body;

    //AGGIUNGI VALIDAZIONE

    const user = {
        email: email,
        password: password,
        name: name,
        surname: surname
    };

    try {
      await Users.create({user})
      res.status(200).json({
          message: "User successfully created",
          data: user
        })
    } catch (error) {
      res.status(401).json({
        message: "User not created. Some errors occurred",
        error: error.message
      })
    }
}

const deleteUser = async (req, res, next) => {
    const { id } = req.body;

    try {
        const userToDelete = await Users.findByPk(id);
        await Users.delete({userToDelete});
        res.status(201).json({ 
            message: "User successfully deleted", 
            data: userToDelete 
        });
    } catch(error) {
        res.status(400).json({ 
            message: "An error occurred", 
            error: error.message 
        });
    }
}

const getUsers = async (res, req, next) => {
    try{
        const users = await Users.findAll();
        res.status(200).json({
           message: "Successfully retrived all users",
           data: users 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed retrieval of all users',
            error: error.message
        });
    }
};

const getOneUser = async (req, res, next) => {
    const { email } = req.body;

    try{
        const user = await Users.findByPk(email);
        res.status(200).json({
            message: "Successfully retrieved user",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed retrieval of users",
            error: error.message
        });
    }
};

exports.registerUser = registerUser;
exports.getUsers = getUsers;
exports.getOneUser = getOneUser;
exports.deleteUser = deleteUser;