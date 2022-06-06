/**
 * Using json file as db
 */

const { __DEBUG__, USERS_DB, HTTP_STATUS_CODES } = require("../const/constrefs");
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
    return res.sendStatus(HTTP_STATUS_CODES.No_Content_204);
  }

  const refreshToken = cookies.jwt;

  // Check user data in DB
  const foundedUser = USERS_DB.users.find((person) => person.refreshToken === refreshToken);
  if (!foundedUser) {
    res.clearCookie('jwt', 
                    { 
                      httpOnly: true,
                      sameSite: 'None',
                      secure: true
                    });
    return res.sendStatus(HTTP_STATUS_CODES.No_Content_204);
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
  res.sendStatus(HTTP_STATUS_CODES.No_Content_204);

};

module.exports = { handleLogout };
