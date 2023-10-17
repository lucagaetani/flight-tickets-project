//Routers for Users
const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

router.get('/getAll', usersController.getUsers);

router.post('/registerUser', usersController.registerUser);

router.delete('/deleteUser', usersController.deleteUser);

module.exports = router;