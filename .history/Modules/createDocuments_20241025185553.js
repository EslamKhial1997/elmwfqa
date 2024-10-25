const mongoose = require("mongoose");

const createDocuments = new mongoose.Schema(
  {
    contracts: {
      type: mongoose.Schema.ObjectId,
      ref: "Contracts",
      required: [true, "معرف العقد مطلوب"],
    },
    attorney:Object,
    amount: {
      required: [true, "المبلغ  مطلوب"],
      type: Number,
    },
    kind: String,
    reason: String,

    cash: {
      type: Boolean,
      default: false,
    },
    cheque: {
      type: Boolean,
      default: false, 
    },
    bank: String,
    chequeNumber:String,
    code: {
      type: Number,
     
    },
  },
  { timestamps: true }
);

createDocuments.pre(/^find/, function (next) {
  this.populate({
    path: "contracts",
  });
  next();
});

const createDocumentsModel = mongoose.model(
  "Documents",
  createDocuments
);
module.exports = createDocumentsModel;
