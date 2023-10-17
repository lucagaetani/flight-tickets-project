//Routers for Users
const express = require('express');
const { body } = require('express-validator');
const usersController = require('../controllers/users');

const router = express.Router();

const validateUser = [
    body('email')
    .trim()
    .notEmpty()
    .isEmail(),
    body('password')
    .trim()
    .notEmpty()
    .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 2,
        minSymbols: 2
    }),
    body('name')
    .trim()
    .notEmpty(),
    body('surname')
    .trim()
    .notEmpty()
]

router.get('/getAll', usersController.getUsers);

router.post('/registerUser', validateUser, usersController.registerUser);

router.delete('/deleteUser', usersController.deleteUser);

module.exports = router;