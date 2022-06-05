const __DEBUG__ = process.env.NODE_ENV === 'production' ? false : true;

const ALLOWED_ORIGINS_AS_WHITE_LISTS = [
  'https://www.yoursite.com',
  'http://127.0.0.1:5500',
  'http://localhost:3500',
];

const USERS_DB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const EMPLOYEES_DB = {
  employees: require("../model/employees.json"),
  setEmployees: function(data) { this.employees = data}
};

module.exports = { __DEBUG__, ALLOWED_ORIGINS_AS_WHITE_LISTS, USERS_DB, EMPLOYEES_DB }
