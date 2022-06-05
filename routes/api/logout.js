const express = require("express");
const router = express.Router();

const refreshLogoutController = require("../../controllers/logoutController");

// get
router.route("/").get(refreshLogoutController.handleLogout);

module.exports = router;
