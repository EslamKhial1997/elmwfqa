const { check } = require("express-validator");

const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");

const createEmployeesModel = require("../Modules/createEmployees");

exports.createEmployeesValidation = [
  check("identity")
    .notEmpty()
    .withMessage("is required identity")
    .custom((val) =>
      createEmployeesModel.findOne({ identity: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error(" رقم الهويه موجود بالفعل"));
        }
      })
    ),
  check("name").notEmpty().withMessage("is required identity"),
  check("username")
    .optional()
    .custom((val) =>
      createEmployeesModel.findOne({ username: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("اسم الموظف موجود بالفعل"));
        }
      })
    ),
  MiddlewareValidator,
];

exports.updateEmployeesValidation = [
  check("username")
    .optional()
    .custom((val, { req }) =>
      createEmployeesModel
        .findOne({ username: req.body.username })
        .then((user) => {
          if (user && req.body.username !== user.username) {
            const employees = createEmployeesModel.findOne({
              username: req.body.username,
            });
            if (employees) {
              return Promise.reject(new Error("اسم الموظف موجود بالفعل"));
            }
          }
        })
    ),
  check("identity")
    .optional()
    .custom((val, { req }) =>
      createEmployeesModel.findOne({ _id: req.body.id }).then((user) => {
        if (user && req.body.identity !== user.identity) {
          const employees = createEmployeesModel.findOne({
            identity: req.body.identity,
          });
          if (employees) {
            return Promise.reject(new Error("رقم الهويه موجود بالفعل"));
          }
        }
      })
    ),
  MiddlewareValidator,
];
