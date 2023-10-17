const Users = require('../models/users');
const bcrypt = require("bcryptjs");

const login = async (req, res, next) => {

    const { email, password } = req.body
    
    // Check if username and password is provided
    if (!email || !password) {
        res.status(400).json({
            message: "Username or password not found"
        });
    }

    try {
        const user = await Users.findByPk(email);
        if (!user) {
            res.status(401).json({
                message: "Login not successful. User not found"
            })
        } else {
            //Compare the hashed password with the password i pass through register page
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                res.status(200).json({
                    message: "Login successful"
                });
            } else {
                res.status(400).json({ 
                    message: "Login not successful"
                });
            }
        }
        } catch (error) {
            res.status(400).json({
                message: "An error occurred",
                error: error.message
            });
    }
}

exports.login = login;