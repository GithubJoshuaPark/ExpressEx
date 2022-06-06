const express = require("express");
const router = express.Router();

//const registerController = require("../../controllers/registerController");
const registerController = require("../../controllers/registerControllerMongo");

router.route("/").post(registerController.handleNewUser);

module.exports = router;
