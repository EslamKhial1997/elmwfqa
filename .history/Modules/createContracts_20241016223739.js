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
    pricePaidDeposit:Number,
    pdf:String,
    HowToBuy: String,
    attorney:[],
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
      default: false,
    },
    depositRallyStatus: {
      type: String,
      enum: [
        "negotiateAprice",
        "foreclosedProperty",
        "propertyUnderConstruction",
        "other",
      ],
    
    },
    depositStatus: {
      type: String,
      enum: [
        "lounge",
        "land",
        "vila",
        "apartment",
        "architecture",
        "townhouse",
        "other",
      ],
    
    },

    paidFristDeposit: {
      type: Boolean,
    },
    available: {
      type: Boolean,
      default: true,
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
