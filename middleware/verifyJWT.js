const jwt = require("jsonwebtoken");
const { __DEBUG__ } = require("../const/constrefs");
require("dotenv").config();

const baseFileName = __filename.split("/")[__filename.split("/").length - 1];

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;  // "Bearer fdafda...."
 
  if (__DEBUG__) {  
    console.log(`[${baseFileName} > req.headers.authorization]: `, authHeader);
  }

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  // jwt verify
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Invalid Token
    }

    // ref decoded of the payload data
    if(__DEBUG__) {
      console.log(`[${baseFileName} > jwt token decoded]: `, decoded);
    }
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });

};


module.exports = verifyJWT;