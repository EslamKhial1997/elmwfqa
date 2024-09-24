const { Router } = require("express");

const { protect } = require("../Services/AuthService");
const { createDocumentsValidation, getDocumentsValidator } = require("../Resuble/DocumentValidation");
const { createDouments, getDocument, getDocuments } = require("../Services/DocumentsService");


const Routes = Router();
Routes.use(protect);

Routes.route("/")
  .post(createDocumentsValidation, createDouments)
  .get(getDocuments);
Routes.route("/:id").get(getDocumentsValidator, getDocument); 
module.exports = Routes;
