const jwt = require("jsonwebtoken");

const verifyUserToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }
};

const verifyCookie = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    return res.status(200).json({
      success: true,
      message: "Cookie parsed correctly",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }
};

exports.verifyCookie = verifyCookie;
exports.verifyUserToken = verifyUserToken;
