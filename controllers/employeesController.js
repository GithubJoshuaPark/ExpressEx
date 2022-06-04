const data = {
  employees: require("../model/employees.json"),
  setEmployees: function(data) { this.employees = data}
};

const { __DEBUG__ } = require("../const/constrefs");

if (__DEBUG__) {
  const baseFileName = __filename.split('/')[__filename.split('/').length - 1]
    console.log(`[${baseFileName} > data employees]: `, data.employees);
}

// MARK: - REST Handlers
const getAllEmployees = (req, res) => {
  // get all employees by sort
  const sortedArray = data.employees.sort((a,b) => a.id > b.id ? 1 : (a.id < a.id ? -1 : 0)); 
  data.setEmployees(sortedArray);
  res.json(data.employees);
};

const postEmployee = (req, res) => {
  // insert
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }
  if(!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({
      'message': 'First and last names are required.'
    })
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const putEmployee = (req, res) => {
  // update
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  console.log(`[putEmployee]:`, employee);

  if(!employee) {
    return res.status(400).json({"message": `Employ ID ${req.body.id} not found`});
  }
  if(req.body.firstname) employee.firstname = req.body.firstname;
  if(req.body.lastname) employee.lastname = req.body.lastname;
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  const unsortedArray = [...filteredArray, employee];
  const sortedArray = unsortedArray.sort((a,b) => a.id > b.id ? 1 : ( a.id < b.id ? -1 : 0));
  console.log(`[putEmployee sortedArray ]:`, sortedArray );
  data.setEmployees(sortedArray);
  res.json(data.employees);
};

const delEmployee = (req, res) => {
  // del
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if(!employee) {
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
  }
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  // get the specified id employee data
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
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
