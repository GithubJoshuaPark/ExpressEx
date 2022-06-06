const jwt = require("jsonwebtoken");
const { __DEBUG__, HTTP_STATUS_CODES } = require("../const/constrefs");
const baseFileName  = __filename.split("/")[__filename.split("/").length - 1];

const verifyJWT = (req, res, next) => {
  const accessToken = req.headers.authorization || req.headers.Authorization;  // "Bearer fdafda...."
 
  if (__DEBUG__) {  
    console.log(`[${baseFileName} > req.headers.authorization]: `, accessToken);
  }

  if (!accessToken?.startsWith('Bearer ')) {
    return res.sendStatus(HTTP_STATUS_CODES.Unauthorized_401);
  }

  const token = accessToken.split(" ")[1];

  // jwt verify
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(HTTP_STATUS_CODES.Forbidden_403);
    }

    // ref decoded of the payload data
    if(__DEBUG__) {
      console.log(`[${baseFileName} > jwt token decoded payload]: `, decoded);
    }
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;