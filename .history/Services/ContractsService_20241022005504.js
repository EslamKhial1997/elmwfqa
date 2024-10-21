const expressAsyncHandler = require("express-async-handler");
const createContractsModel = require("../Modules/createContracts");
const factory = require("./FactoryHandler");
const createExchangeModel = require("../Modules/createDocuments");
const { filePathImage } = require("../Utils/imagesHandler");
const createDocumentsModel = require("../Modules/createDocuments");
const ApiError = require("../Resuble/ApiErrors");
const FeatureApi = require("../Utils/Feature");
const createNotificationsModel = require("../Modules/createNotifications");
const createEmployeesModel = require("../Modules/createEmployees");
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.pdf = req.file.filename;
  }

  next();
});
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

exports.getContracts = expressAsyncHandler(async (req, res) => {
  let fillter = {};
  if (req.filterObject) {
    fillter = req.filterObject;
  }

  const countDocs = await createContractsModel.countDocuments();
  const ApiFeatures = new FeatureApi(
    createContractsModel.find(fillter),
    req.query
  )
    .Fillter(createContractsModel)
    .Sort()
    .Fields()
    .Search()
    .Paginate(countDocs);
  const { MongooseQueryApi, PaginateResult } = ApiFeatures;
  const getDoc = await MongooseQueryApi;
  const now = new Date();
  const notificationsToSend = getDoc.filter(async (notification) => {
    const notificationDate = new Date(notification.createdAt);
    const diffTime = Math.abs(now - notificationDate); // الفرق في الوقت بين الآن وتاريخ الإشعار
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // تحويل الفرق إلى أيام
    return diffDays > 0; // تحقق إذا كان الفرق أكبر من يومين
  });
 

  notificationsToSend.forEach(async (notification) => {
    console.log(notifications);
    
    const notificationDoc = await createNotificationsModel.find({contracts:notification._id})
    if (notificationDoc) {
      return 
    }
    console.log(notificationDoc);
    
    const employees = await createEmployeesModel.find({
      $or: [
        { role: "manager" },
        { _id: notification.employees._id }, // تأكد أن notification.employees هنا يحتوي على قيمة صحيحة
      ],
    });
    const marketersNotifications = employees.map(async (marketer) => {
      
      return createNotificationsModel.create({
        assignedBy: notification.user._id, // من قام بإسناد الإشعار
        assignedTo: marketer._id, // تعيين الإشعار لكل مسوق
        contracts: notification._id, // تعيين الإشعار لكل مسوق
        msg: `${notification.user.name} تم انشاء العقد منذ يومين`, // الرسالة
      });
    });

    const allNotifications = [...marketersNotifications];

    await Promise.all(allNotifications);
  });
  res
    .status(201)
    .json({ results: getDoc.length, PaginateResult, data: getDoc });
});
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

  // تحديث العقد
  try {
    const findDocument = await createContractsModel.findById(req.params.id);
    if (findDocument.pdf) {
      const baseUrl = `${process.env.BASE_URL}/pdf/`;
      const relativePathImage = findDocument.pdf.replace(baseUrl, "");
      const split = relativePathImage.split(
        `${process.env.BASE_URL}/contracts/`
      )[1];
      if (relativePathImage) {
        filePathImage("contracts", split);
      }
    }
    const updateDocById = await createContractsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updateDocById) {
      return next(
        new ApiError(
          `Sorry Can't Update This ID From ID :${req.params.id}`,
          404
        )
      );
    }

    if (req.body.paidKind === "cash") {
      await createContractsModel.updateOne(
        { _id: req.params.id },
        { $unset: { employeesBank: "", phone: "", bank: "" } }
      );
    }
    try {
      if (
        req.body.statusDetails.emptying.kind &&
        req.body.contractsStatus === "emptying"
      ) {
        const document = await createDocumentsModel.findOne({
          contracts: req.body.id,
        });

        if (document.amount < document.contracts.saay) {
          return res.status(500).json({
            status: "error",
            msg: "لايمكن افراغ العقد لان مبلغ السعي اقل من مبلغ الصرف",
          });
        }
      }

      // أكمل العملية هنا إذا كانت الشروط متحققة
    } catch (error) {
      // التعامل مع الأخطاء
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", msg: "حدث خطأ غير متوقع" });
    }

    await updateDocById.save();
    res.status(200).json({ msg: "Success Update", data: updateDocById });
  } catch (error) {
    console.error("Error updating contract:", error);
    res.status(500).json({ status: "error", msg: "Failed to update contract" });
  }
});

exports.deleteContract = factory.deleteOne(createContractsModel);

exports.createExchange = factory.createOne(createExchangeModel);
exports.getExchanges = factory.getAll(createExchangeModel);
exports.getExchange = factory.getOne(createExchangeModel);
