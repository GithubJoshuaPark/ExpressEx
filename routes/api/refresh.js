const express = require("express");
const router = express.Router();

//const refreshTokenController = require("../../controllers/refreshTokenController");
const refreshTokenController = require("../../controllers/refreshTokenControllerMongo");

// get
router.route("/").get(refreshTokenController.handleRefreshToken);

module.exports = router;
