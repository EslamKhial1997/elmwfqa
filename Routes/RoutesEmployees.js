const { Router } = require("express");

const {
  createEmployees,
  getEmployeess,
  getEmployees,
  deleteEmployees,
  updateEmployees,
  getNotifications,
} = require("../Services/EmployeesService");
const { protect, getLoggedUserData } = require("../Services/AuthService");
const { deleteSpecificNotification } = require("../Services/TasksService");
const { createEmployeesValidation, updateEmployeesValidation } = require("../Resuble/EmplooyesValidation");

const Routes = Router();
Routes.use(protect);

Routes.route("/")
  .post(createEmployeesValidation, createEmployees)
  .get(getEmployeess);


Routes.route("/:id")
  .get(getEmployees)
  .delete(deleteEmployees)
  .put(updateEmployeesValidation,updateEmployees);
module.exports = Routes;
