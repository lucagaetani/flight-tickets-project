//Routers for Users
const express = require('express');
const { body } = require('express-validator');
const usersController = require('../controllers/users');
const auth = require('../middleware/auth.js');

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
];

router.get('/login', auth.verifyUserToken, usersController.login);

router.get('/getAll', auth.verifyUserToken, usersController.getUsers);

router.get('/getOne', auth.verifyUserToken, usersController.getUser);

router.post('/registerUser', auth.verifyUserToken, validateUser, usersController.registerUser);

router.delete('/deleteUser', auth.verifyUserToken, usersController.deleteUser);

module.exports = router;