const { Router } = require("express");

const { protect } = require("../Services/AuthService");
const { deletePermission } = require("../Services/permissionService");
const createUsersModel = require("../Modules/createUsers");
const createEmployeesModel = require("../Modules/createEmployees");

const Routes = Router();

// Only Access the Logged Users
Routes.use(protect);
Routes.put("/:type/:id", (req, res, next) => {
  const { type } = req.params;

  // تحديد النموذج بناءً على النوع
  let model;
  if (type === "employees") { 
    model = createEmployeesModel;
  } else if (type === "customer") {
    model = createUsersModel;
  } else {
    return res.status(400).json({ message: "نوع غير صالح" });
  }

  // استدعاء deletePermission مع النموذج المناسب
  deletePermission(model)(req, res, next);
});
// Routes.route("/:id").put( (req, res, next) => {
//   const model = req.model;
//   deletePermission(model)(req, res, next);
// });

module.exports = Routes;
