const Users = require('../models/users');


const register = async (req, res, next) => {
    const { email, password, name, surname } = req.body

    //AGGIUNGI VALIDAZIONE

    const user = {
        email: email,
        password: password,
        name: name,
        surname: surname
    };

    try {
      await Users.create({user})
      res.status(200).json({
          message: "User successfully created",
          data: user
        })
    } catch (error) {
      res.status(401).json({
        message: "User not created. Some errors occurred",
        error: error.message
      })
    }
}

const login = async (req, res, next) => {

    const { email, password } = req.body
    
    // Check if username and password is provided
    if (!email || !password) {
        res.status(400).json({
            message: "Username or password not found"
        });
    }

    try {
        const user = await Users.findOne({ email, password });
        if (!user) {
            res.status(401).json({
                message: "Login not successful. User not found"
            })
        } else {
            res.status(200).json({
                message: "Login successful",
                data: user
            })
        }
        } catch (error) {
            res.status(400).json({
                message: "An error occurred",
                error: error.message
            });
    }
}

exports.register = register;
exports.login = login;