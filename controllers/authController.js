/**
 * Using json file as db
 */

const fsPromises    = require("fs").promises;
const path          = require("path");
const bcrypt        = require("bcrypt");
const { __DEBUG__, USERS_DB, HTTP_STATUS_CODES } = require("../const/constrefs");
const jwt           = require("jsonwebtoken");
// require("dotenv").config(); --> moved into server.js
const baseFileName = __filename.split("/")[ __filename.split("/").length - 1];

/**
 * Checking req.body.user, pwd and make JWT and send it
 * @param {*} req
 * @param {*} res
 * @returns
 */
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (__DEBUG__) {    
    console.log(`[${baseFileName} > req body]: `, req.body);
  }

  if (!user || !pwd) {
    return res.status(HTTP_STATUS_CODES.Bad_Request_400).json({
      message: `Username and password are required.`,
    });
  }

  const foundedUser = USERS_DB.users.find((person) => person.username === user);
  if (!foundedUser) {
    return res
      .status(HTTP_STATUS_CODES.Unauthorized_401)
      .json({ message: `User ID ${req.body.user} not found` });
  }

  // Evaluate pwd
  const match = await bcrypt.compare(pwd, foundedUser.password);
  if (match) {
    // TODO: 🍎 create JWTs (normal token, refresh token)
    const roles = Object.values(foundedUser.roles);

    const accessToken = jwt.sign(
      { 
        "UserInfo": {
          "username": foundedUser.username,
          "roles": roles
        } 
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );

    const refreshToken = jwt.sign(
      { "username": foundedUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user to invalidate 
    // the refreshToken when the current user log out before the e
    const otherUsers = USERS_DB.users.filter(person => person.username !== foundedUser.username);
    const currentUser = {...foundedUser, refreshToken}
    
    USERS_DB.setUsers([...otherUsers, currentUser])

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(USERS_DB.users)
    )

    // MARK: - Send accessToken and refreshToken to the current user
    // Send the refreshToken for 1 day contained into the cookie object to the front-end side
    // ,but this cookie only readable with http protocol, not accessable by the javascript.
    res.cookie('jwt', 
                refreshToken, 
                {
                  httpOnly: true,
                  sameSite: 'None',
                  // secure: true,  // commented to let this 'jwt' cookie be referred as req.cookie later
                  maxAge: 24 * 60 * 60 * 1000
                }
              ) ;

    // Send the accessToken to the frond-end side 
    // and it should be handled just in the memory for security issue
    res.json({ accessToken });  

  } else {
    return res
      .status(HTTP_STATUS_CODES.Unauthorized_401)
      .json({ message: `User ID ${req.body.user} not found` });
  }
};

module.exports = { handleLogin }
