const expressAsyncHandler = require("express-async-handler");
const createContractsModel = require("../Modules/createContracts");
const factory = require("./FactoryHandler");
const createExchangeModel = require("../Modules/createDocuments");

exports.createContracts = expressAsyncHandler(async (req, res) => {
  req.body.employees = req.user.id;

  // تعيين البيانات المشتركة
  const statusDetails = {
    paper: {
      kind: false,
      date: 4,
      status: "processing",
      text: "تجهيز الورق",
      type: "paper",
    },
    emptying: {
      kind: false,
      date: 1,
      status: "processing",
      text: "الإفراغ",
      type: "emptying",
    },
  };

  // التحقق من نوع الدفع
  if (req.body.paidKind !== "cash") {
    Object.assign(statusDetails, {
      tawqieAltalab: {
        kind: false,
        date: 2,
        status: "processing",
        text: "توقيع الطلب",
        type: "tawqieAltalab",
      },
      evaluation: {
        kind: false,
        date: 3,
        status: "processing",
        text: "طلب تقييم",
        type: "evaluation",
      },
      result: {
        kind: false,
        date: 3,
        status: "processing",
        text: "نتيجة التقييم",
        type: "result",
      },
      release: {
        kind: false,
        date: 3,
        status: "processing",
        text: "اصدار العقود",
        type: "release",
      },
      signature: {
        kind: false,
        date: 2,
        status: "processing",
        text: "توقيع العقود",
        type: "signature",
      },
      cheque: {
        kind: false,
        date: 5,
        status: "processing",
        text: "إصدار الشيك",
        type: "cheque",
      },
    });
  } else {
    Object.assign(statusDetails, {
      tax: {
        kind: false,
        date: 3,
        status: "processing",
        text: "اصدار ضريبة",
        type: "tax",
      },
    });
  }

  // إضافة تفاصيل الحالة إلى الجسم
  req.body.deposit ? (req.body.statusDetails = statusDetails) : null;
  req.body.deposit ? (req.body.contractsStatus = "paper") : null;
  req.body.deposit ? (req.body.available = true) : false;
  req.body.deposit ? (req.body.UpdateStatus = Date.now()) : null;

  // إنشاء العقد وحفظه
  const contracts = await createContractsModel.create(req.body);
  await contracts.save();

  // إرجاع استجابة النجاح
  res.status(200).json({
    status: "success",
    data: contracts,
  });
});

exports.getContracts = factory.getAll(createContractsModel);
exports.getContract = factory.getOne(createContractsModel);
exports.updateContractsStatus = factory.updateOne(createContractsModel);
exports.deleteContract = factory.deleteOne(createContractsModel);
exports.cancel = expressAsyncHandler(async (req, res, next) => {
  const await createContractsModel.findByIdAndUpdate(
    req.params.id,
    { available: false },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: contracts,
  });
});
exports.createExchange = factory.createOne(createExchangeModel);
exports.getExchanges = factory.getAll(createExchangeModel);
exports.getExchange = factory.getOne(createExchangeModel);
