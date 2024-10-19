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
    provideFirstPaid: {
      type: Boolean,
      default: false,
    },
    pricePaidDeposit: Number,
    pdf: String,

    HowToBuy: String,
    attorney: [
      {
        attorney: { type: String }, // أو أي حقول أخرى تحتاجها
      },
    ],
    saay: Number,
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
    },
    depositStatus: {
      type: String,
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
const ImageURL = (doc) => {
  if (doc.pdf && !doc.pdf.includes(`${process.env.BASE_URL}/contracts`)) {
    const pdf = `${process.env.BASE_URL}/contracts/${doc.pdf}`;
    doc.pdf = pdf;
  }
};

// حفظ المسار النسبي في قاعدة البيانات
createContracts.post("init", (doc) => {
  ImageURL(doc); // إضافة الـ BASE_URL عند الحاجة
});

createContracts.post("save", (doc) => {
  ImageURL(doc);
});



const createContractsModel = mongoose.model("TestContracts", createContracts);
module.exports = createContractsModel;
