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

    /**
     * If i'm beyond 3 hours (max age of token), token expires
     */
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (((Math.floor(Date.now() / 1000)-decoded.iat)*1000) > 10800000) {
      res.clearCookie("jwt");
      return res.status(401).json({
        success: false,
        message: "Expired token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cookie parsed correctly",
      userData: {
        name: decoded.name,
        surname: decoded.surname,
        email: decoded.email
      }
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
