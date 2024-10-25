const factory = require("./FactoryHandler");
const createUsersModel = require("../Modules/createUsers");
exports.deletePermission = (model) => async (req, res, next) => {
  try {
    const { id } = req.params; // الحصول على id من معلمات الطلب

    // التحقق مما إذا كان المستخدم موجودًا
    const user = await model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // حذف حقلي كلمة المرور واسم المستخدم
    await model.updateOne(
      { _id: id }, // الشرط: العثور على المستخدم باستخدام _id
      { $unset: { password: "", username: "" } } // إزالة الحقول المطلوبة
    );

    // إعادة استجابة النجاح
    res
      .status(200)
      .json({
        msg: `تم إزالة كلمة السر واسم المستخدم للمستخدم ذو المعرف ${id}`,
      });
  } catch (error) {
    next(error); // تمرير الخطأ إلى middleware الخاص بالتعامل مع الأخطاء
  }
};

exports.updateUser = factory.updateOne(createUsersModel);
