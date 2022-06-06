const __DEBUG__ = process.env.NODE_ENV === "production" ? false : true;

const ALLOWED_ORIGINS_AS_WHITE_LISTS = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];

const USERS_DB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const EMPLOYEES_DB = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const ROLES_LIST = {
  Admin: 5150,
  Editor: 1984,
  User: 2001,
};

const HTTP_STATUS_CODES = {
  Created_201: 201, // Created
  No_Content_204: 204, // No Content
  Bad_Request_400: 400, // Bad Request
  Unauthorized_401: 401, // Unauthorized
  Forbidden_403: 403, // Forbidden
  Not_Found_404: 404, // Not found
  Conflict_409: 409, // Conflict
  Internal_Server_Err_500: 500, // Internal Server Error
};

module.exports = {
  __DEBUG__,
  ALLOWED_ORIGINS_AS_WHITE_LISTS,
  USERS_DB,
  EMPLOYEES_DB,
  ROLES_LIST,
  HTTP_STATUS_CODES,
};
