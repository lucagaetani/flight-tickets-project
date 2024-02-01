const Users = require("../models/users");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The response object.
 */
const registerUser = async (req, res, next) => {
  //With the result of the validation, if there's an error, it sends an error message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error: invalid JSON",
    });
  }

  const { email, password, name, surname } = req.body;

  try {
    const existingUser = await Users.findByPk(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //Encrypt password with 10 salt rounds with bcryptjs library
    const hash = await bcrypt.hash(password, 10);

    const user = {
      email: email,
      password: hash,
      name: name,
      surname: surname,
    };
    await Users.create(user);

    //Set the maxAge of the token to 3 hours
    const maxAge = 3 * 60 * 60 * 1000;

    //Sign the token
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        surname: user.surname,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: maxAge,
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge,
      path: "/",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User successfully created",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "User not created. Some errors occurred",
      error: error.message,
    });
  }
};

/**
 * Updates a user's information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 * @return {Promise} A promise that resolves to the updated user object.
 */
const editUser = async (req, res, next) => {
  //With the result of the validation, if there's an error, it sends an error message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error: invalid JSON",
    });
  }

  try {
    const oldEmail = req.body.oldEmail;
    const newEmail = req.body.newEmail;
    const { name, surname, password } = req.body;

    //It checks if there's another user with the same email as the new email that you want to change.
    const existingUser = await Users.findByPk(newEmail);
    if (existingUser && !(existingUser.email === newEmail)) {
      return res.status(400).json({
        success: false,
        message: "Email you want to change already exists. Cannot update email",
      });
    }

    const userToUpdate = {
      email: newEmail,
      name,
      surname
    }

    if (password) {
      //Hashes the password with 10 salt rounds with bcryptjs library
      const hash = await bcrypt.hash(password, 10);
      userToUpdate.password = hash;
    }

    //Updates the user's info
    const updatedUser = await Users.update(userToUpdate, {
      where: {
        email: oldEmail,
      },
    });

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Errors during update, user not updated",
      });
    }

    const viewData = {
      name: name,
      surname: surname,
      email: newEmail
    };

    return res.status(200).json({
      success: true,
      message: "User successfully updated",
      data: viewData,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
}

/**
 * Authenticates a user by comparing the provided email and password with the database records.
 *
 * @param {Object} req - The request object containing the user's email and password.
 * @param {Object} res - The response object used to send the authentication result.
 * @param {Function} next - The next function in the middleware chain.
 * @return {Object} The response object containing the authentication result.
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if username and password is provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Username or password not found",
    });
  }

  try {
    const user = await Users.findByPk(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Login not successful. User not found",
      });
    } else {
      //Compare the crypted password with bcryptjs library
      const result = await bcrypt.compare(password, user.password);
      //If decrypted password is the same of the password stored in the database, continue
      if (result) {
        //Set the maxAge of the cookie to 3 hours
        const maxAge = 3 * 60 * 60 * 1000;
        //Sign the token with jwt library
        const token = jwt.sign(
          {
            email: user.email,
            name: user.name,
            surname: user.surname,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: maxAge,
          }
        );

        const viewData = {
          name: user.name,
          surname: user.surname,
          email: user.email
        };

        //Set the cookie to the server
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge,
          path: "/",
          sameSite: "strict",
        });

        res.status(200).json({
          success: true,
          message: "User successfully logged in",
          data: viewData,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Login not successful",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

/**
 * Validates a password by comparing it with the stored user password.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The response object containing a success status and a message.
 */
const checkPassword = async (req, res, next) => {
  try {
    const { email, password } = JSON.parse(decodeURIComponent(req.query.state));
    const user = await Users.findByPk(email);
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Password matches",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
}

/**
 * Logs out a user.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {object} The JSON response indicating the success or failure of the logout operation.
 */
const logout = async (req, res, next) => {
  try {
    //It deletes the cookie
    res.clearCookie("jwt");
    res.status(200).json({
      success: true,
      message: "User successfully logged out",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred during logout",
      error: error.message,
    });
  }
};

const getUser = async (req, res, next) => {
  const email = req;

  try {
    const user = await Users.findByPk(email);
    return {
      success: true,
      message: "Successfully retrieved user",
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed retrieval of users",
      error: error.message,
    };
  }
};

exports.login = login;
exports.getUser = getUser;
exports.logout = logout;
exports.registerUser = registerUser;
exports.editUser = editUser;
exports.checkPassword = checkPassword;
