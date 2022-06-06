/**
 * Using cloud mongo db as db
 */

const User          = require('../model/UserForMongoSchema');
const { __DEBUG__ } = require("../const/constrefs");
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
    return res.sendStatus(204) // No content
    // return res.status(204).json({
    //   message: `There are no JWT you have gotten before.`,
    // });
  }

  const refreshToken = cookies.jwt;

  // Check user data in DB
  const foundedUser  = await User.findOne({ refreshToken }).exec(); // 🍎
  if (!foundedUser) {
    //return res.sendStatus(403) // Forbidden
    res.clearCookie('jwt', 
                    { 
                      httpOnly: true,
                      sameSite: 'None',
                      secure: true
                    });
    return res.sendStatus(204)
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
  res.sendStatus(204);

};

module.exports = { handleLogout };
