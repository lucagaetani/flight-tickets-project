const express = require("express");
const authenticationController = require("../auth/auth");

const router = express.Router();

router.post('/login', authenticationController.login);

module.exports = router;