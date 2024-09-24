const { check } = require("express-validator");

const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");

exports.LoginValidator = [
  check("password").notEmpty().withMessage("is required Password"),
  check("username").notEmpty().withMessage("is required userName"),

  MiddlewareValidator,
];
