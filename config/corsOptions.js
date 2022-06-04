const { WHITELIST_FOR_CORS }  = require("../const/constrefs");

// Cross Origin Resource Sharing List Checking using WHITELIST
const corsOptions = {
  origin: (origin, callback) => {
    if (WHITELIST_FOR_CORS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions