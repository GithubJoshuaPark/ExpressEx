const express = require("express");
const router = express.Router();

//const authController = require("../../controllers/authController");
const authController = require("../../controllers/authControllerMongo");

// post
router.route("/").post(authController.handleLogin);

module.exports = router;
