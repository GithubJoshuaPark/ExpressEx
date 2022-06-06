const bcrypt        = require("bcrypt");
const { __DEBUG__, USERS_DB } = require("../const/constrefs");
const jwt           = require("jsonwebtoken");
// require("dotenv").config(); --> moved into server.js

const baseFileName = __filename.split("/")[ __filename.split("/").length - 1];

/**
 * Issue a new accessToken by checking the previous issued refreshToken
 * @param {*} req
 * @param {*} res
 * @returns
 */
const handleRefreshToken = (req, res) => {
  const cookies = req.cookies

  if (__DEBUG__) {
    console.log(`[${baseFileName} > req cookies]: `, cookies);
  }

  if (!cookies?.jwt) {
    return res.status(401).json({
      message: `There are no JWT you have gotten before.`,
    });
  }

  const refreshToken = cookies.jwt;

  const foundedUser = USERS_DB.users.find((person) => person.refreshToken === refreshToken);
  if (!foundedUser) {
    //return res.sendStatus(403) // Forbidden
    return res
      .status(403)
      .json({ message: `User not found by the refreshToken: ${refreshToken}` });
  }

  // Evaluate Jwt  
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if(err || foundedUser.username !== decoded.username) {
      return res
      .status(403)
      .json({ message: `Delivered RefreshToken: ${refreshToken} is not valid` });
    }

    const roles = Object.values(foundedUser.roles);

    const accessToken = jwt.sign(
      { 
        "UserInfo": {
          "username": foundedUser.username,
          "roles": roles
        } 
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s'}
    );

    // send accessToken to the frond-end side 
    // and it should be handled just in the memory for security issue
    res.json({ accessToken }); 
  })

};

module.exports = { handleRefreshToken };
