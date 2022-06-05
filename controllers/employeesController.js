const { __DEBUG__, EMPLOYEES_DB } = require("../const/constrefs");
const baseFileName = __filename.split('/')[__filename.split('/').length - 1]

if (__DEBUG__) { 
  console.log(`[${baseFileName} > EMPLOYEES_DB employees]: `, EMPLOYEES_DB.employees);
}

// MARK: - REST Handlers
const getAllEmployees = (req, res) => {
  // get all employees by sort
  const sortedArray = EMPLOYEES_DB.employees.sort((a,b) => a.id > b.id ? 1 : (a.id < a.id ? -1 : 0)); 
  EMPLOYEES_DB.setEmployees(sortedArray);
  res.json(EMPLOYEES_DB.employees);
};

const postEmployee = (req, res) => {
  // insert
  const newEmployee = {
    id: EMPLOYEES_DB.employees[EMPLOYEES_DB.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }
  if(!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({
      'message': 'First and last names are required.'
    })
  }
  EMPLOYEES_DB.setEmployees([...EMPLOYEES_DB.employees, newEmployee]);
  res.status(201).json(EMPLOYEES_DB.employees);
};

const putEmployee = (req, res) => {
  // update
  const employee = EMPLOYEES_DB.employees.find(emp => emp.id === parseInt(req.body.id));
  console.log(`[putEmployee]:`, employee);

  if(!employee) {
    return res.status(400).json({"message": `Employ ID ${req.body.id} not found`});
  }
  if(req.body.firstname) employee.firstname = req.body.firstname;
  if(req.body.lastname) employee.lastname = req.body.lastname;
  const filteredArray = EMPLOYEES_DB.employees.filter(emp => emp.id !== parseInt(req.body.id));
  const unsortedArray = [...filteredArray, employee];
  const sortedArray = unsortedArray.sort((a,b) => a.id > b.id ? 1 : ( a.id < b.id ? -1 : 0));
  console.log(`[putEmployee sortedArray ]:`, sortedArray );
  EMPLOYEES_DB.setEmployees(sortedArray);
  res.json(EMPLOYEES_DB.employees);
};

const delEmployee = (req, res) => {
  // del
  const employee = EMPLOYEES_DB.employees.find(emp => emp.id === parseInt(req.body.id));
  if(!employee) {
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
  }
  const filteredArray = EMPLOYEES_DB.employees.filter(emp => emp.id !== parseInt(req.body.id));
  EMPLOYEES_DB.setEmployees([...filteredArray]);
  res.json(EMPLOYEES_DB.employees);
};

const getEmployee = (req, res) => {
  // get the specified id employee data
  const employee = EMPLOYEES_DB.employees.find(emp => emp.id === parseInt(req.params.id));
  if(!employee) {
    return res.status(400).json({"message": `Employee ID ${req.params.id} not found`});
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
