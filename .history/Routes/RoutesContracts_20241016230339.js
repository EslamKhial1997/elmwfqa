const { Router } = require("express");
const {
  createContracts,
  getContracts,
  getContract,
  updateContractsStatus,
  deleteContract,
 

} = require("../Services/ContractsService");
const { protect } = require("../Services/AuthService");
const { uploadPDF, resizePDF } = require("../Utils/imagesHandler");


const Routes = Router();
Routes.use(protect);
Routes.route("/").post(uploadPDF,resizePDF("contracts"),createContracts).get(getContracts);
Routes.route("/:id").get(getContract).put(updateContractsStatus).delete(deleteContract);

module.exports = Routes;