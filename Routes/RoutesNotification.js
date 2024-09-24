const { Router } = require("express");

const { protect } = require("../Services/AuthService");

const { getMyNotification, deleteNotification } = require("../Services/NotificationService");

const Routes = Router();
Routes.use(protect);

Routes.route("/").get(getMyNotification);
Routes.route("/:id").delete(deleteNotification);

module.exports = Routes;
