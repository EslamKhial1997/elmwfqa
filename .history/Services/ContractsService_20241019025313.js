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

  // تعيين التفاصيل إذا كان هناك عربون
  if (req.body.deposit) {
    req.body.statusDetails = statusDetails;
    req.body.contractsStatus = "paper";
    req.body.available = true;
    req.body.UpdateStatus = Date.now();
  }

  // تحويل "attorney" من JSON إلى مصفوفة
  try {
    if (req.body.attorney) {
      req.body.attorney = JSON.parse(req.body.attorney);
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      msg: "Invalid attorney data format",
    });
  }

  try {
    // إنشاء العقد وحفظه
    const contracts = await createContractsModel.create(req.body);
    await contracts.save();

    // إرجاع استجابة النجاح
    res.status(200).json({
      status: "success",
      data: contracts,
    });
  } catch (error) {
    // التعامل مع أي أخطاء أثناء إنشاء العقد
    res.status(500).json({
      status: "error",
      msg: "Failed to create contract",
      error: error.message,
    });
  }
});

exports.getContracts = factory.getAll(createContractsModel);
exports.getContract = factory.getOne(createContractsModel);
exports.updateContractsStatus = expressAsyncHandler(async (req, res, next) => {
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

  // معالجة بيانات المحامي
  try {
    if (req.body.attorney) {
      req.body.attorney = JSON.parse(req.body.attorney);
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      msg: "Invalid attorney data format",
    });
  }

  // معالجة تفاصيل الحالة
  try {
    if (req.body.statusDetails) {
      req.body.statusDetails = JSON.parse(req.body.statusDetails);
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      msg: "Invalid statusDetails data format",
    });
  }

  // تعيين التفاصيل إذا كان هناك عربون
  if (req.body.deposit && !req.body.statusDetails) {
    req.body.statusDetails = statusDetails;
    req.body.contractsStatus = "paper";
    req.body.available = true;
  }

  // حذف الحقول بناءً على نوع الدفع
  if (req.body.paidKind === "cash") {
    await createContractsModel.updateOne(
      { _id: req.params.id },
      { $unset: { employeesBank: "", phone: "", bank: "" } }
    );
  }

  // تحديث العقد
  try {
    const updateDocById = await createContractsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updateDocById) {
      return next(new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404));
    }

    await updateDocById.save();
    res.status(200).json({ status: "Success Update", data: updateDocById });
  } catch (error) {
    console.error("Error updating contract:", error);
    res.status(500).json({ status: "error", msg: "Failed to update contract" });
  }
});


exports.deleteContract = factory.deleteOne(createContractsModel);
// exports.cancelContracts = expressAsyncHandler(async (req, res, next) => {
//   const contracts =await createContractsModel.findByIdAndUpdate(
//     req.params.id,
//     { available: false },
//     { new: true }
//   );
//   res.status(200).json({
//     status: "success",
//     data: contracts,
//   });
// });
exports.createExchange = factory.createOne(createExchangeModel);
exports.getExchanges = factory.getAll(createExchangeModel);
exports.getExchange = factory.getOne(createExchangeModel);
