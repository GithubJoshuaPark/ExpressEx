/**
 * Using cloud mongo db as db
 */

const User          = require('../model/UserForMongoSchema');
const { __DEBUG__, HTTP_STATUS_CODES } = require("../const/constrefs");
const jwt           = require("jsonwebtoken");

const baseFileName = __filename.split("/")[ __filename.split("/").length - 1];

/**
 * Issue a new accessToken by checking the previous issued refreshToken
 * @param {*} req
 * @param {*} res
 * @returns
 */
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies

  if ( __DEBUG__ ) {
    console.log(`[${baseFileName} > req cookies(current refreshToken)]: `, cookies);
  }

  if (!cookies?.jwt) {
    return res.status(HTTP_STATUS_CODES.Unauthorized_401).json({
      message: `There are no JWT you have gotten before.`,
    });
  }

  const refreshToken = cookies.jwt;
  const foundedUser  = await User.findOne({ refreshToken: refreshToken }).exec(); // 🍎

  if (!foundedUser) {
    return res
      .status(HTTP_STATUS_CODES.Forbidden_403)
      .json({ message: `User not found by the refreshToken: ${refreshToken}` });
  }

  // Evaluate Jwt  
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if(err || foundedUser.username !== decoded.username) {
      return res
      .status(HTTP_STATUS_CODES.Forbidden_403)
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
      { expiresIn: '60s'}
    );

    // send accessToken to the frond-end side 
    // and it should be handled just in the memory for security issue
    res.json({ accessToken }); 
  })

};

module.exports = { handleRefreshToken };
