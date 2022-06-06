const express = require("express");
const router = express.Router();

//const refreshLogoutController = require("../../controllers/logoutController");
const refreshLogoutController = require("../../controllers/logoutControllerMongo");

// get
router.route("/").get(refreshLogoutController.handleLogout);

module.exports = router;
