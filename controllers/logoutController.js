/**
 * Using json file as db
 */

const { __DEBUG__, USERS_DB } = require("../const/constrefs");
const fsPromises    = require("fs").promises;
const path          = require("path");

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
  const foundedUser = USERS_DB.users.find((person) => person.refreshToken === refreshToken);
  if (!foundedUser) {
    //return res.sendStatus(403) // Forbidden
    res.clearCookie('jwt', 
                    { 
                      httpOnly: true,
                      sameSite: 'None',
                      secure: true
                    });
    return res.sendStatus(204) // Not Content
  }

  // Delete the refreshToken in DB
  const otherUsers = USERS_DB.users.filter(person => person.refreshToken !== foundedUser.refreshToken);
  const currentUser = {...foundedUser, refreshToken: ''};
  USERS_DB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(USERS_DB.users));

  res.clearCookie('jwt', 
                  { 
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true
                  }); // secure: true - only serves on https
  res.sendStatus(204); // Not Content

};

module.exports = { handleLogout };
