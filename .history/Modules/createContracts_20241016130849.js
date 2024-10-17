const mongoose = require("mongoose");

const createContracts = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "معرف العميل مطلوب"],
    },
    unity: {
      type: String,
    },
    unityprice: {
      type: Number,
    },
    HowToBuy: String,
    attorney: String,
    saay: String,
    depositSaay: Number,
    remainingSaay: Number,
    employees: {
      type: mongoose.Schema.ObjectId,
      ref: "Employees",
      required: [true, "رقم معرف الموظف مطلوب"],
    },
    paidKind: {
      type: String,
      enum: ["cash", "bank", "nonbank"],
    },
    bank: String,
    employeesBank: String,
    phone: String,
    deposit: {
      type: Boolean,
      default: false,
    },
    depositRally: {
      type: Boolean,
      default: true,
    },
    depositRallyStatus: {
      type: String,
      enum: [
        "negotiateAprice",
        "foreclosedProperty",
        "propertyUnderConstruction",
        "other",
      ],
      default: "negotiateAprice", // يمكنك تحديد القيمة الافتراضية هنا إذا رغبت
    },

    paidFristDeposit: {
      type: Boolean,
   
    },
    available: {
      type: Boolean,
     default: false,
    },
    UpdateStatus: {
      type: Date,
    
    },
    statusDetails: Object,
    notes: String,
    contractsStatus: String,
  },
  { timestamps: true }
);

createContracts.pre(/^find/, function (next) {
  this.populate({
    path: "user",
  }).populate({
    path: "employees",
    select: "name  ",
  });
  next();
});

const createContractsModel = mongoose.model("TestContracts", createContracts);
module.exports = createContractsModel;
