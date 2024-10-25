const { Router } = require("express");

const { LoginValidator } = require("../Resuble/AuthvalidatorError");

const { Login } = require("../Services/AuthService");

const Routes = Router();

Routes.route("/login").post(LoginValidator, Login);

module.exports = Routes;
