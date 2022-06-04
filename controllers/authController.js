const usersDB = {
  users: require('../model/users.json'),
  setUsers: function(data) { this.users = data}
}

const bcrypt        = require('bcrypt')
const { __DEBUG__ } = require('../const/constrefs')

/**
 * Checking req.body.user, pwd and make JWT and send it
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if(__DEBUG__) {
    const baseFileName = __filename.split('/')[__filename.split('/').length - 1]
    console.log(`[${baseFileName} > req body]: `, req.body);
  }

  if(!user || !pwd) {
    return res.status(400).json(
      {
        "message": `Username and password are required.`
      }
    )
  }

  const foundedUser = usersDB.users.find(person => person.username === user)
  if(!foundedUser) {
    //return res.sendStatus(401) // Unauthorized
    return res.status(401).json({"message": `User ID ${req.body.user} not found`});
  } 

  // Evaluate pwd
  const match = await bcrypt.compare(pwd, foundedUser.password)
  if (match) {

    // TODO: 🍎 create JWTs (normal token, refresh token)

    res.json({'success': `User ${user} is logged in!`})
  } else {
    //res.sendStatus(401);
    return res.status(401).json({"message": `User ID ${req.body.user} not found`});
  }
}

module.exports = {handleLogin}