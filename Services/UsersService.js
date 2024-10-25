const factory = require("./FactoryHandler");
const expressAsyncHandler = require("express-async-handler");

const createUsersModel = require("../Modules/createUsers");
const FeatureApi = require("../Utils/Feature");

exports.createUsers = expressAsyncHandler(async (req, res) => {
  req.body.employees = req.user._id;
  const user = await createUsersModel.create(req.body);
  await user.save();
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.getUsers = expressAsyncHandler(async (req, res, next) => {
  // بناء الاستعلام بناءً على دور المستخدم
  let fillter = {};
  if (req.filterObject) {
    fillter = req.filterObject;
  }
  if (req.user.role !== "manager") {
    fillter = {
      $or: [
        { marketers: { $in: [req.user._id] } }, // إذا كان معرف المستخدم موجودًا في مصفوفة marketers
        { employees: req.user._id }, // أو إذا كان معرف المستخدم موجودًا في employees
      ],
    };
  }

  // استرجاع المستخدمين بناءً على الفلتر
  await createUsersModel.find(fillter);

  const countDocs = await createUsersModel.countDocuments();
  const ApiFeatures = new FeatureApi(createUsersModel.find(fillter), req.query)
    .Fillter(createUsersModel)
    .Sort()
    .Fields()
    .Search()
    .Paginate(countDocs);
  const { MongooseQueryApi, PaginateResult } = ApiFeatures;
  const getDoc = await MongooseQueryApi;
  // إرسال الاستجابة
  res
    .status(200)
    .json({ results: getDoc.length, PaginateResult, data: getDoc });
});

exports.getUser = (model) => factory.getOne(model);

exports.deleteUser = expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createUsersModel.findByIdAndDelete(req.params.id);
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

exports.updateUser = factory.updateOne(createUsersModel);
