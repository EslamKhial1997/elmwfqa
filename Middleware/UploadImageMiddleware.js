const multer = require("multer");
const ApiError = require("../Resuble/ApiErrors");


const MulterOptions = () => {
  const storage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Image Allowed", 400), false);
    }
  };
  const upload = multer({ storage: storage, fileFilter: multerFilter });
  return upload;
};

exports.UploadSingleImage = (ImageName) => MulterOptions().single(ImageName);
exports.UploadMultiImage = (ArrOfImage) => MulterOptions("data").fields(ArrOfImage);
