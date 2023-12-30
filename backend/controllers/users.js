const Users = require("../models/users");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
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

    //Encrypt password with 10 salt rounds
    const hash = await bcrypt.hash(password, 10);

    const user = {
      email: email,
      password: hash,
      name: name,
      surname: surname,
    };
    await Users.create(user);

    const maxAge = 3 * 60 * 60 * 1000;
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

const deleteUser = async (req, res, next) => {
  const { id } = req.body;

  try {
    const userToDelete = await Users.findByPk(id);
    await Users.delete({ userToDelete });
    res.status(201).json({
      success: true,
      message: "User successfully deleted",
      data: userToDelete,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

const getUsers = async (res, req, next) => {
  try {
    const users = await Users.findAll();
    res.status(200).json({
      success: true,
      message: "Successfully retrived all users",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed retrieval of all users",
      error: error.message,
    });
  }
};

const editUser = async (req, res, next) => {
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

    const existingUser = await Users.findByPk(newEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email you want to change already exists. Cannot update email",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const userToUpdate = {
      email: newEmail,
      name,
      surname,
      password
    }

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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
}

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
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const maxAge = 3 * 60 * 60 * 1000;
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

const logout = async (req, res, next) => {
  try {
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

exports.login = login;
exports.logout = logout;
exports.registerUser = registerUser;
exports.editUser = editUser;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.checkPassword = checkPassword;
exports.deleteUser = deleteUser;
