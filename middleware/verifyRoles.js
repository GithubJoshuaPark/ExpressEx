const { __DEBUG__, HTTP_STATUS_CODES } = require("../const/constrefs");
const baseFileName = __filename.split("/")[__filename.split("/").length - 1];

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if(!req?.roles) return res.sendStatus(HTTP_STATUS_CODES.Unauthorized_401);

    const rolesArray = [...allowedRoles];
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);

    if(__DEBUG__) {
      console.log(`[${baseFileName} > rolesArray(required role)]: `, rolesArray);
      console.log(`[${baseFileName} > req.roles(user's role)]: `   , req.roles );  // comming from jwt
      console.log(`[${baseFileName} > result]: `                   , result    );
    }

    if(!result) return res.sendStatus(HTTP_STATUS_CODES.Unauthorized_401);

    next();

  }
}

module.exports = { verifyRoles }