const jwt = require("jsonwebtoken");
const { __DEBUG__ } = require("../const/constrefs");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];  // "Bearer fdafda...."
  
  if (__DEBUG__) {
    const baseFileName =
    __filename.split("/")[__filename.split("/").length - 1];
    console.log(`[${baseFileName} > req.headers['authorization']]: `, authHeader);
  }

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  // jwt verify
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Invalid Token
    }
    req.user = decoded.username;
    next();
  });

};


module.exports = verifyJWT;