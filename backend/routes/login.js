const express = require("express");
const authenticationController = require("../auth/auth");

const router = express.Router();

router.post('/', authenticationController.login);

module.exports = router;