const Users = require('../models/users');
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation error: invalid JSON"
      });
    }

    const { email, password, name, surname } = req.body;

    try {
        const existingUser = await Users.findByPk(email);
        if (existingUser){
            return res.status(400).json({
                message: "User with this email already exists in database"
              });
        }

        //Encrypt password with 10 salt rounds
        const hash = await bcrypt.hash(password, 10);

        const user = {
            email: email,
            password: hash,
            name: name,
            surname: surname
        };
        await Users.create(user);

        const maxAge = 15*60;
        const token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                surname: user.surname
            },
            //process.env.jwtToken,
            {
                expiresIn: maxAge
            }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge
        });

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

const getUser = async (req, res, next) => {
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

const login = async (req, res, next) => {

    const { email, password } = req.body
    
    // Check if username and password is provided
    if (!email || !password) {
        res.status(400).json({
            message: "Username or password not found"
        });
    }

    try {
        const user = await Users.findByPk(email);
        if (!user) {
            res.status(401).json({
                message: "Login not successful. User not found"
            })
        } else {
            //Compare the hashed password with the password i pass through register page
            const result = await bcrypt.compare(password, user.password);
            if (result) {

                const maxAge = 3*60*60;
                const token = jwt.sign(
                    {
                        email: user.email,
                        name: user.name,
                        surname: user.surname
                    },
                    //process.env.jwtToken,
                    {
                        expiresIn: maxAge
                    }
                );

                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge
                });

                res.status(200).json({
                    message: "User successfully logged in"
                });
            } else {
                res.status(400).json({ 
                    message: "Login not successful"
                });
            }
        }
        } catch (error) {
            res.status(400).json({
                message: "An error occurred",
                error: error.message
            });
    }
}

exports.login = login;
exports.registerUser = registerUser;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;