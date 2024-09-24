const expressAsyncHandler = require("express-async-handler");
const factory = require("./FactoryHandler");
const createNotificationsModel = require("../Modules/createNotifications");
exports.getMyNotification = expressAsyncHandler(async (req, res, next) => {
  // استخدام $or لتحديد أن الشرط يمكن أن يكون إما assignedBy أو assignedTo
  const notifications = await createNotificationsModel.find({
      assignedTo: req.user._id 
  });

  // إرسال الاستجابة مع البيانات التي تم العثور عليها
  res.status(200).json({
    message: "Notifications retrieved successfully",
    data: notifications,
  });
});

exports.deleteNotification = factory.deleteOne(createNotificationsModel);
