const bcrypt        = require("bcrypt");
const { __DEBUG__ } = require("../const/constrefs");
const jwt           = require("jsonwebtoken");
require("dotenv").config();

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

/**
 * Issue a new accessToken by checking the previous issued refreshToken
 * @param {*} req
 * @param {*} res
 * @returns
 */
const handleRefreshToken = (req, res) => {
  const cookies = req.cookies

  if (__DEBUG__) {
    const baseFileName = __filename.split("/")[ __filename.split("/").length - 1];
    console.log(`[${baseFileName} > req cookies]: `, cookies);
  }

  if (!cookies?.jwt) {
    return res.status(401).json({
      message: `There are no JWT you have gotten before.`,
    });
  }

  const refreshToken = cookies.jwt;

  const foundedUser = usersDB.users.find((person) => person.refreshToken === refreshToken);
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

    const accessToken = jwt.sign(
      { "username": decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s'}
    );

    // send accessToken to the frond-end side 
    // and it should be handled just in the memory for security issue
    res.json({ accessToken }); 
  })

};

module.exports = { handleRefreshToken };
