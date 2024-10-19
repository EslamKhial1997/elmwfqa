const expressAsyncHandler = require("express-async-handler");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { UploadMultiImage, UploadSinglePDF } = require("../Middleware/UploadImageMiddleware");
const fs = require("fs");
const ensureUploadDirExists = (type) => {
  const dir = `../uploads/${type}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
exports.resizePDF =(type)=> expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.pdf = req.file.filename;
  }
  ensureUploadDirExists(type)
  next();
});
exports.resizeImage = (type) =>
  expressAsyncHandler(async (req, res, next) => {
    if (!req.files || !req.files.images || req.files.images.length === 0) {
      // إذا لم يكن هناك صور مرفوعة، يمكن متابعة الطلب بدون أي معالجة للصور
      return next();
    }

    req.body.images = [];

    // تأكد من أن المجلد موجود
    ensureUploadDirExists(type);

    await Promise.all(
      req.files?.images.map(async (ele, inx) => {
        const imageType = ele.mimetype.split("image/")[1] || "jpeg";
        const filename = `${type}-${uuidv4()}-${Date.now()}-${
          inx + 1
        }.${imageType}`;

        await sharp(ele.buffer)
          .resize(1024, 1024)
          .toFormat(imageType)
          .jpeg({ quality: 95 })
          .toFile(`../uploads/${type}/${filename}`);

        req.body.images.push({
          image: filename,
        });
      })
    );

    next();
  });


exports.UploadImageService = UploadMultiImage([
  { name: "images", maxCount: 8 },
]);
exports.fsRemove = async (filePath) => {
  console.log(filePath);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath); // حذف الملف
    } catch (error) {
      return next(
        new ApiError(`Error deleting the image: ${error.message}`, 500)
      );
    }
  }
};

exports.filePathImage = (fileName, relativePathimage) => {
  const filePath = path.join(
    __dirname,
    `../uploads/${fileName}/`,
    relativePathimage
  );
  this.fsRemove(filePath);
};
exports.filePathImageContracts = (fileName, relativePathimage) => {
  const filePath = path.join(
    __dirname,
    `../uploads/${fileName}/`
  );
  this.fsRemove(filePath);
};
exports.uploadPDF = UploadSinglePDF("pdf");