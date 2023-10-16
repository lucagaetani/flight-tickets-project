//Routers for Users
const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');
router.get('/users', usersController.getUsers);

module.exports = router;