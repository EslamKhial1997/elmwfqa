const { check } = require("express-validator");

const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createUsersModel = require("../Modules/createUsers");

exports.createUserValidation = [
  check("identity")
    .notEmpty()
    .withMessage("is required identity")
    .custom((val) =>
      createUsersModel.findOne({ identity: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error(" رقم الهويه موجود بالفعل"));
        }
      })
    ),
  check("name").notEmpty().withMessage("is required identity"),
  check("username")
    .optional()
    .custom((val) =>
      createUsersModel.findOne({ username: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("اسم المستخدم موجود بالفعل"));
        }
      })
    ),
  MiddlewareValidator,
];
// exports.updateUserValidation = [
//   check("username")
//     .optional()
//     .custom((val, { req }) =>
//       createUsersModel.findOne({ username: val }).then((user) => {
//         if (user && user._id.toString() !== req.params.id) {
//           // إذا كان اسم المستخدم موجودًا وكان مستخدم آخر غير المستخدم الحالي
//           return Promise.reject(new Error("اسم المستخدم موجود بالفعل"));
//         }
//       })
//     ),
//   check("identity")
//     .optional()
//     .custom((val, { req }) =>
//       createUsersModel.findOne({ identity: val }).then((user) => {
//         if (user && user._id.toString() !== req.params.id) {
//           // إذا كان رقم الهوية موجودًا وكان مستخدم آخر غير المستخدم الحالي
//           return Promise.reject(new Error("رقم الهويه موجود بالفعل"));
//         }
//       })
//     ),
//   MiddlewareValidator,
// ];
exports.updateUserValidation = [
  check("username")
    .optional()
    .custom((val, { req }) =>
      createUsersModel
        .findOne({ username: req.body.username })
        .then((user) => {
          if (user && req.body.username !== user.username) {
            const employees = createUsersModel.findOne({
              username: req.body.username,
            });
            if (employees) {
              return Promise.reject(new Error("اسم المستخدم موجود بالفعل"));
            }
          }
        })
    ),
  check("identity")
    .optional()
    .custom((val, { req }) =>
      createUsersModel.findOne({ _id: req.body.id }).then((user) => {
        if (user && req.body.identity !== user.identity) {
          const employees = createUsersModel.findOne({
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