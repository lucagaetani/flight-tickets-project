//Routers for Users
const express = require("express");
const { body } = require("express-validator");
const usersController = require("../controllers/users");
const auth = require("../middleware/auth.js");

const router = express.Router();

//Middleware to validate the info that arrives with the API POST request
const validateUser = [
  body("email").trim().notEmpty().isEmail(),
  body("password").trim().notEmpty().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 2,
    minSymbols: 2,
  }),
  body("name").trim().notEmpty(),
  body("surname").trim().notEmpty(),
];

const validateUserToEdit = [
  body("oldEmail").trim().notEmpty().isEmail(),
  body("newEmail").trim().notEmpty().isEmail(),
  body("name").trim().notEmpty(),
  body("surname").trim().notEmpty(),
  body("password")
    .trim()
    .if(body("password").notEmpty())
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 2,
      minSymbols: 2,
    }),
]

router.post("/login", usersController.login);

router.get("/getAll", usersController.getUsers);

router.get("/getOne", usersController.getUser);

router.get("/checkPassword", usersController.checkPassword);

router.post("/registerUser", validateUser, usersController.registerUser);

router.post("/editUser", validateUserToEdit, usersController.editUser);

//It hasn't to be validates, nothing it sent and there aren't operations on the database
router.post("/logout", auth.verifyUserToken, usersController.logout);

router.delete("/deleteUser", usersController.deleteUser);

module.exports = router;
