const { check } = require("express-validator");
const {
  MiddlewareValidator,
} = require("../Middleware/MiddlewareValidatorError");
const createContractsModel = require("../Modules/createContracts");
const ApiError = require("./ApiErrors");
const createDocumentsModel = require("../Modules/createDocuments");

exports.createDocumentsValidation = [
  check("contracts")
    .notEmpty()
    .withMessage("معرف العقد مطلوب")
    .custom((val) =>
      createContractsModel.findOne({ _id: val }).then((contracts) => {
        if (!contracts) {
          return new ApiError(" معرف العقد غير صحيح ", 404);
        }
      })
    ),
  check("contracts").notEmpty().withMessage("معرف العقد مطلوب"),
  check("amount").notEmpty().withMessage(" المبلغ مطلوب"),

  MiddlewareValidator,
];
exports.getDocumentsValidator = [
  check("id").isMongoId().withMessage("المعرف غير صحيح"),
  MiddlewareValidator,
];
