const { __DEBUG__ } = require("../const/constrefs");
const baseFileName = __filename.split("/")[__filename.split("/").length - 1];

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if(!req?.roles) return res.sendStatus(401); // UnAuthorized

    const rolesArray = [...allowedRoles];
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);

    if(__DEBUG__) {
      console.log(`[${baseFileName} > rolesArray]: `, rolesArray);
      console.log(`[${baseFileName} > req.roles]: ` , req.roles );  // comming from jwt
      console.log(`[${baseFileName} > result]: `    , result    );
    }

    if(!result) return res.sendStatus(401); // UnAuthorized

    next();

  }
}

module.exports = { verifyRoles }