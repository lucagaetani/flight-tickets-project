const Users = require('../models/users');

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

exports.login = login;