const factory = require("./FactoryHandler");


const createContractsModel = require("../Modules/createContracts");
const expressAsyncHandler = require("express-async-handler");
const createNotificationsModel = require("../Modules/createNotifications");
const createEmployeesModel = require("../Modules/createEmployees");
const createDocumentsModel = require("../Modules/createDocuments");

exports.createDouments = expressAsyncHandler(async (req, res) => {
 
  
    try {
      // إنشاء الوثيقة
      const createDoc = await createDocumentsModel.create(req.body);
  
      // تحديث contracts فقط إذا تم إنشاء createDoc بنجاح
      const contracts = await createContractsModel.findByIdAndUpdate(
        req.body.contracts,
        { available: req.body.kind === "taking" ? true : false},
        { new: true }
      );
  
      // جلب الموظفين ذوي الدور "manager"
      const employees = await createEmployeesModel.find({
        role: "manager",
      });
  
      // إنشاء إشعار لكل ماركتر
      const marketersNotifications = contracts.user.marketers.map((marketer) => {
        
        return createNotificationsModel.create({
          assignedBy: contracts.user._id, // من قام بإسناد الإشعار
          assignedTo: marketer._id,       // تعيين الإشعار لكل مسوق
          contracts: contracts._id,       // تعيين الإشعار لكل مسوق
          msg: `${req.user.name} قام بألغاء العقد`,           // الرسالة
        });
      });
  
      // إنشاء إشعار لكل مدير
      const managersNotifications = employees.map((manager) => {
        return createNotificationsModel.create({
          assignedBy: contracts.user._id, // من قام بإسناد الإشعار
          assignedTo: manager._id,   
          contracts: contracts._id,      // تعيين الإشعار لكل مدير
          msg: `${req.user.name} قام بألغاء العقد`,             // الرسالة
        });
      });
  
      // دمج الإشعارات معاً (المسوقين والمدراء)
      const allNotifications = [...marketersNotifications, ...managersNotifications];
  
      // انتظر حتى يتم إنشاء جميع الإشعارات
      await Promise.all(allNotifications);
  
      // إرسال الاستجابة في حالة النجاح
      res.status(201).json({
        status: "success",
        data: createDoc,
      });
    } catch (error) {
      // إرسال استجابة الخطأ في حالة حدوث خطأ أثناء الإنشاء
      res.status(400).json({
        status: "fail",
        message: "Failed to create DoumentscreateDouments or update contracts",
        error: error.message,
      });
    }
  });
  
exports.getDocuments = factory.getAll(createDocumentsModel);
exports.getDocument = factory.getOne(createDocumentsModel);
