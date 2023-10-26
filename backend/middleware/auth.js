const jwt = require('jsonwebtoken');

const verifyUserToken =  (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(400).send("Invalid token.");
    }
};

exports.verifyUserToken = verifyUserToken;