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
      default: "cash",
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
      status: ["negotiateAprice" ,"foreclosedProperty" ,"Property under construction"],
    },
    paidFristDeposit: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
    UpdateStatus: {
      type: Date,
      default: Date.now,
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

const createContractsModel = mongoose.model("Contracts", createContracts);
module.exports = createContractsModel;
