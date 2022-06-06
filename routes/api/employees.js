const express = require("express");
const router  = express.Router();

//const employeesController = require("../../controllers/employeesController");
const employeesController = require("../../controllers/employeesControllerMongo");
const { ROLES_LIST } = require("../../const/constrefs");
const { verifyRoles } = require("../../middleware/verifyRoles");
// const verifyJWT = require('../../middleware/verifyJWT');

router
  .route("/")
  //.get(verifyJWT, employeesController.getAllEmployees)
  .get(employeesController.getAllEmployees)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.postEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.putEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.delEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
