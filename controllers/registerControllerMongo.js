/**
 * Using cloud mongo db as db
 */
const User   = require('../model/UserForMongoSchema');
const bcrypt = require('bcrypt');

const { __DEBUG__, HTTP_STATUS_CODES } = require('../const/constrefs');
const baseFileName = __filename.split('/')[__filename.split('/').length - 1]

// MARK: - REST Handlers
const handleNewUser = async(req, res) => {
  const { user, pwd } = req.body;
  if(!user || !pwd) return res.status(HTTP_STATUS_CODES.Bad_Request_400).json({
    "message": `Username and password are required.`
  })

  // Check for duplicate usename in the db
  const idDuplicate = await User.findOne({ username: user}).exec(); // 🍎
  
  if(idDuplicate) {
    return res.status(HTTP_STATUS_CODES.Conflict_409).json({
      "message": `Already the user exists`
    })
  } 
  
  try {
    // Encrypt pwd
    const hashedPwd = await bcrypt.hash(pwd, 10)  // apply 10 times sort around
    
    // Store the new user to the cloud mongo db using mongoose shcema model, User
    const newUser = {
      //"id": automatically generated in the Mogo DB
      "username": user, 
      // "roles": default value shall apply with with the User shcema definition
      "password": hashedPwd
    };

    const result = await User.create(newUser);

    if(__DEBUG__) {
      console.log(`[${baseFileName} > register a user result]: `, newUser, result);
    }

    res.status(HTTP_STATUS_CODES.Created_201).json({'success': `New user ${user} created`})

  } catch (error) {
    res.status(HTTP_STATUS_CODES.Internal_Server_Err_500).json({"message": error.message})
  }
}

module.exports = {handleNewUser}
