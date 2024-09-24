const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");


const ApiError = require("../Resuble/ApiErrors");

const createUsersModel = require("../Modules/createUsers");
const createEmployeesModel = require("../Modules/createEmployees");
;
exports.getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});



exports.Login = expressAsyncHandler(async (req, res, next) => {
  let user = await createUsersModel.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  let employees = await createEmployeesModel.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.DB_URL, {
      expiresIn: "90d",
    });
    return res.status(200).json({ data: user, token });
  } else if (employees) {
    // createMessage();

    const token = jwt.sign({ userId: employees._id }, process.env.DB_URL, {
      expiresIn: "90d",
    });
    return res.status(200).json({ data: employees, token });
  } else {
    throw new ApiError("خطا في اسم المستخدم او كلمه السر", 500);
  }
});
exports.allowedTo = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          status: "Error",
          massage: "You are not allowed to access this route",
        })
      );
    }
    next();
  });
exports.protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  // استخراج التوكن من الهيدر
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // التحقق من وجود التوكن
  if (!token) {
    return res.status(401).json({
      statusCode: "Error",
      message: "Invalid token. Please login again.",
    });
  }

  // التحقق من صحة التوكن
  const decoded = jwt.verify(token, process.env.DB_URL);
  if (!decoded) {
    return res.status(401).json({
      statusCode: "Error",
      message: "Invalid token. Please login again.",
    });
  }

  // العثور على المستخدم بناءً على الـID المستخرج من التوكن
  const currentUser =
    (await createUsersModel.findById(decoded.userId)) ||
    (await createEmployeesModel.findById(decoded.userId));

  if (!currentUser) {
    return res.status(401).json({
      statusCode: "Error",
      message: "User or Employees not found.",
    });
  }

  // التحقق مما إذا قام المستخدم بتغيير كلمة المرور بعد إصدار التوكن
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // إذا تم تغيير كلمة المرور بعد إنشاء التوكن
    if (passChangedTimestamp > decoded.iat) {
      return res.status(401).json({
        statusCode: "Error",
        message: "User recently changed his password. Please login again.",
      });
    }
  }

  // تحديد الدور وتعيين النموذج المناسب
  if (
    currentUser.role === "manager" ||
    currentUser.role === "supervisor" ||
    currentUser.role === "accountant" ||
    currentUser.role === "marketer"
  ) {
    req.model = createEmployeesModel;
  } else if (currentUser.role === "user") {
    req.model = createUsersModel;
  } else {
    return res.status(403).json({
      statusCode: "Error",
      message:
        "Access denied. You do not have permission to perform this action.",
    });
  }

  req.user = currentUser;

  next();
});
