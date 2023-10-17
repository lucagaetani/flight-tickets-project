//Routers for Users
const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');
router.get('/getAll', usersController.getUsers);

module.exports = router;