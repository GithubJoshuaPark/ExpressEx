const express = require("express");
const router  = express.Router();

const employeesController = require("../../controllers/employeesController");
const verifyJWT = require('../../middleware/verifyJWT');

router
  .route("/")
  .get(verifyJWT, employeesController.getAllEmployees)
  .post(employeesController.postEmployee)
  .put(employeesController.putEmployee)
  .delete(employeesController.delEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
