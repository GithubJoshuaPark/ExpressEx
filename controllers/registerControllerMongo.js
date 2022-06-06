/**
 * Using cloud mongo db as db
 */
const User   = require('../model/UserForMongoSchema');
const bcrypt = require('bcrypt');

const { __DEBUG__ } = require('../const/constrefs');
const baseFileName = __filename.split('/')[__filename.split('/').length - 1]

// MARK: - REST Handlers
const handleNewUser = async(req, res) => {
  const { user, pwd } = req.body;
  // 400: Bad Request
  if(!user || !pwd) return res.status(400).json({
    "message": `Username and password are required.`
  })

  // Check for duplicate usename in the db
  const idDuplicate = await User.findOne({ username: user}).exec(); // 🍎
  
  if(idDuplicate) {
    //return res.sendStatus(409) // Conflict
    return res.status(409).json({
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

    // 201: Created
    res.status(201).json({'success': `New user ${user} created`})

  } catch (error) {
    // 500: Internal Server Error
    res.status(500).json({"message": error.message})
  }
}

module.exports = {handleNewUser}
