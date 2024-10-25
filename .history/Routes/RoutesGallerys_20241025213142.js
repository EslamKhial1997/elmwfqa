const { Router } = require("express");
const {
  getValidator,
  deleteValidator,
  updateValidator,
} = require("../Resuble/ResubleValidation");
const {
  createGallery,
  getGallerys,
  getGallery,
  deleteGallery,
  updateGallery,
} = require("../Services/GalleryService");
const { UploadImageService, resizeImage } = require("../Utils/imagesHandler");


const Routes = Router();

Routes.route("/")
  .post(UploadImageService, resizeImage("gallery"), createGallery)
  .get(getGallerys);

Routes.route("/:id")
  .get(getValidator, getGallery)
  .delete(deleteValidator, deleteGallery)
  .put(updateValidator, updateGallery);
module.exports = Routes;
