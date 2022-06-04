const usersDB = {
  users: require('../model/users.json'),
  setUsers: function(data) { this.users = data}
}

const fsPromises = require('fs').promises
const path       = require('path')
const bcrypt     = require('bcrypt')
const { __DEBUG__ } = require('../const/constrefs')

if (__DEBUG__) {
  const baseFileName = __filename.split('/')[__filename.split('/').length - 1]
  console.log(`[${baseFileName} > data users]: `, usersDB.users);
}

// MARK: - REST Handlers
const handleNewUser = async(req, res) => {
  const { user, pwd } = req.body;
  if(!user || !pwd) return res.status(400).json({
    "message": `Username and password are required.`
  })

  // Check for duplicate usename in the db
  const idDuplicate = usersDB.users.find(person => person.username === user)
  
  if(idDuplicate) return res.sendStatus(409) // Conflict
  
  try {
    // Encrypt pwd
    const hashedPwd = await bcrypt.hash(pwd, 10)  // apply 10 times sort around
    
    // Store the new user
    const newUser = {"username": user, "password": hashedPwd}

    // Add new user into the userDB(Memory)
    usersDB.setUsers([...usersDB.users, newUser])

    // Add new User data into the file(DB)
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    )

    if(__DEBUG__) {
      console.log(`[registerController]: `, usersDB.users)
    }

    res.status(201).json({'success': `New user ${user} created`})

  } catch (error) {
    res.status(500).json({"message": error.message})
  }
}

module.exports = {handleNewUser}
