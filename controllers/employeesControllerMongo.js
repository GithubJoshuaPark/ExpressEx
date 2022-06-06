/**
 * Using cloud mongo db as db
 */
const Employee      = require('../model/EmployeeForMongoSchema');
const { __DEBUG__ } = require("../const/constrefs");
const baseFileName = __filename.split('/')[__filename.split('/').length - 1]

// MARK: - REST Handlers
const getAllEmployees = async (req, res) => {
  // get all employees
  const employees   = await Employee.find().exec();  
  if(!employees) {
    // 204: No Content
    return res.status(204).json({'message': 'No employee found'})
  };
  res.json(employees);
};

const postEmployee = async (req, res) => {
  // insert
  if(!req?.body?.firstname || !req?.body?.lastname) { 
    // 400: Bad Request
    return res.status(400).json({'message': 'First and last names are required'});
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname
    });

    if(__DEBUG__) {
      console.log(`[${baseFileName}]: `, result);
    }
    // 201: Created
    res.status(201).json(result);

  } catch (error) {
    console.error(error);
  }
};

const putEmployee = async (req, res) => {
  // update
  if(!req?.body?.id) {
    // 400 Bad Request
    return res.status(400).json({'message': 'ID parameter is required'});
  }

  const employee = await Employee.findOne({_id: req.body.id}).exec();
  if(__DEBUG__) {
    console.log(`[${baseFileName}]: putEmployee `, employee);
  } 

  if(!employee) {
    // 400 Bad Request
    return res.status(400).json({"message": `Employee of ID(${req.body.id}) not found`});
  }

  if(req.body?.firstname) employee.firstname = req.body.firstname;
  if(req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();
  if(__DEBUG__) {
    console.log(`[${baseFileName}]: the currentEmployee: `, result)
  }

  res.json(result);
};

const delEmployee = async (req, res) => {
  // del
  if(!req?.body?.id) {
    // 400 Bad Request
    return res.status(400).json({'message': 'ID parameter is required'});
  }

  const employee = await Employee.findOne({_id: req.body.id}).exec();
  if(__DEBUG__) {
    console.log(`[${baseFileName}]: for deleting Employee:  `, employee);
  } 

  if(!employee) {
    // 400 Bad Request
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
  }
  
  const result = await employee.delete();
  if(__DEBUG__) {
    console.log(`[${baseFileName}]: the deleteEmployee: `, result)
  }

  res.json(result);
};

const getEmployee = async (req, res) => {
  // get the specified id employee data
  if(!req?.params?.id) {
    // 400 Bad Request
    return res.status(400).json({'message': 'ID parameter is required'});
  }

  const employee = await Employee.findOne({_id: req.params.id}).exec();
  if(!employee) {
    // 400 Bad Request
    return res.status(400).json({"message": `Employee of ID (${req.params.id}) not found`});
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  postEmployee,
  putEmployee,
  delEmployee,
  getEmployee,
};
