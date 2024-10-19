const { Router } = require("express");
const {
  createContracts,
  getContracts,
  getContract,
  updateContractsStatus,
  deleteContract,
  resizeImage,
} = require("../Services/ContractsService");
const { protect } = require("../Services/AuthService");
const { uploadPDF } = require("../Utils/imagesHandler");

const Routes = Router();
Routes.use(protect);
Routes.route("/")
  .post(uploadPDF, resizeImage, createContracts)
  .get(getContracts);
Routes.route("/:id")
  .get(getContract)
  .put(uploadPDF, resizeImage, updateContractsStatus)
  .delete(deleteContract);

module.exports = Routes;
