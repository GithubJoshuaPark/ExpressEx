/**
 * Using json file as db
 */

const fsPromises = require('fs').promises
const path       = require('path')
const bcrypt     = require('bcrypt')
const { __DEBUG__, USERS_DB } = require('../const/constrefs')
const baseFileName = __filename.split('/')[__filename.split('/').length - 1]

if (__DEBUG__) {
  console.log(`[${baseFileName} > data users]: `, USERS_DB.users);
}

// MARK: - REST Handlers
const handleNewUser = async(req, res) => {
  const { user, pwd } = req.body;
  // 400: Bad Request
  if(!user || !pwd) return res.status(400).json({
    "message": `Username and password are required.`
  })

  // Check for duplicate usename in the db
  const idDuplicate = USERS_DB.users.find(person => person.username === user)
  
  if(idDuplicate) {
    //return res.sendStatus(409) // Conflict
    return res.status(409).json({
      "message": `Already the ID exists`
    })
  } 
  
  try {
    // Encrypt pwd
    const hashedPwd = await bcrypt.hash(pwd, 10)  // apply 10 times sort around
    
    // Store the new user
    const newUser = {
      "username": user, 
      "roles": { "User": 2001 },
      "password": hashedPwd
    }

    // Add new user into the userDB(Memory)
    USERS_DB.setUsers([...USERS_DB.users, newUser])

    // Add new User data into the file(DB)
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(USERS_DB.users)
    )

    if(__DEBUG__) {
      console.log(`[${baseFileName} > All registered users]: `, USERS_DB.users);
    }

    // 201: Created
    res.status(201).json({'success': `New user ${user} created`})

  } catch (error) {
    // 500: Internal Server Error
    res.status(500).json({"message": error.message})
  }
}

module.exports = {handleNewUser}
