const factory = require("./FactoryHandler");
const expressAsyncHandler = require("express-async-handler");
const createEmployeesModel = require("../Modules/createEmployees");
exports.createFirstManagerAccount = async () => {
  // التحقق من وجود إما حساب "manager" أو "admin"
  const existingManager = await createEmployeesModel.findOne({
    $or: [
      { username: "manager" },
      { username: "admin" }
    ]
  });

  // إذا كان الحساب موجودًا، طباعة رسالة والعودة
  if (existingManager) {
    console.log("Manager or Admin account already exists");
    return;
  }

  // إنشاء حساب "manager"
  await createEmployeesModel.create({
    name: "manager",
    username: "manager",
    phone: "01000000000",
    identity: "123456",
    role: "manager",
    password: "123456789", // تأكد من أن كلمة المرور نصية
  });

  // إنشاء حساب "admin" بدور "manager"
  await createEmployeesModel.create({
    name: "admin",  
    username: "admin",
    phone: "01000000001", // رقم هاتف مختلف
    identity: "654321", // هوية مختلفة
    role: "manager", // نفس الدور "manager"
    password: "1098648010", // تأكد من أن كلمة المرور نصية
  });

  console.log("Manager and Admin accounts created successfully");
};

exports.createEmployees = expressAsyncHandler(async (req, res) => {
  const Employees = await createEmployeesModel.create(req.body);
  await Employees.save();
  res.status(200).json({
    status: "success",
    data: Employees,
  });
});

exports.getEmployeess = factory.getAll(createEmployeesModel);
exports.getEmployees = factory.getOne(createEmployeesModel);

exports.deleteEmployees = expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createEmployeesModel.findByIdAndDelete(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/admin/`;

  if (!deleteDoc) {
    return next(
      new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
    );
  }
  if (deleteDoc.image) {
    const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    const filePathImage = path.join(
      __dirname,
      "../uploads/admin",
      relativePathimage
    );
    fsRemove(filePathImage);
  }
  res.status(200).json({ message: "Delete Success", data: deleteDoc });
});

exports.updateEmployees = factory.updateOne(createEmployeesModel);
