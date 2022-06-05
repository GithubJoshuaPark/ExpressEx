const req = require("express/lib/request");
const { ALLOWED_ORIGINS_AS_WHITE_LISTS }  = require("../const/constrefs");

// When the front-end side asks with credential option(true) which includes cookie info
// ,the Back-end should set the res.header('Access-Control-Allow-Credentials', true);
const credentials = (req, res, next) =>  {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS_AS_WHITE_LISTS.indexOf(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};

module.exports = credentials