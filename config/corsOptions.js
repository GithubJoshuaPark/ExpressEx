const { ALLOWED_ORIGINS_AS_WHITE_LISTS }  = require("../const/constrefs");

// Cross Origin Resource Sharing List Checking using WHITE-LIST
const corsOptions = {
  origin: (origin, callback) => {
    if (ALLOWED_ORIGINS_AS_WHITE_LISTS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions