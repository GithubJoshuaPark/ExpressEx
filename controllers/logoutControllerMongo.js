/**
 * Using cloud mongo db as db
 */

const User          = require('../model/UserForMongoSchema');
const { __DEBUG__, HTTP_STATUS_CODES } = require("../const/constrefs");
const baseFileName = __filename.split("/")[ __filename.split("/").length - 1];

/**
 * 
 * @param {*} req
 * @param {*} res
 * @returns
 */
const handleLogout = async (req, res) => {
  // (On Client, it also should delete the accessToken in its memory)

  const cookies = req.cookies

  if (__DEBUG__) {
    console.log(`[${baseFileName} > req cookies]: `, cookies);
  }

  if (!cookies?.jwt) {
    return res.sendStatus(HTTP_STATUS_CODES.No_Content_204);
  }

  const refreshToken = cookies.jwt;

  // Check user data in DB
  const foundedUser  = await User.findOne({ refreshToken }).exec(); // 🍎
  if (!foundedUser) {
    res.clearCookie('jwt', 
                    { 
                      httpOnly: true,
                      sameSite: 'None',
                      secure: true
                    });
    return res.sendStatus(HTTP_STATUS_CODES.No_Content_204);
  }

  // Delete the refreshToken of the current User's in Mongo DB
  foundedUser.refreshToken = '';
  const result = await foundedUser.save();
  if(__DEBUG__) {
    console.log(`[${baseFileName}]: the currentUser: `, result)
  }

  res.clearCookie('jwt', 
                  { 
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true // secure: true - only serves on https
                  });
  res.sendStatus(HTTP_STATUS_CODES.No_Content_204);

};

module.exports = { handleLogout };
