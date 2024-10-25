const expressAsyncHandler = require("express-async-handler");
const TaskModel = require("../Modules/createTasks");
const factory = require("./FactoryHandler");
const createNotificationsModel = require("../Modules/createNotifications");
exports.createTask = async (req, res) => {
  const { taskName, taskDuration, taskNotes, assignedTo, status, images , date } =
    req.body;
  const assignedBy = req.user._id; // الشخص الذي ينشئ المهمة (المدير، المشرف، إلخ.)

  try {
    const task = new TaskModel({
      taskName,
      taskDuration,
      taskNotes,
      assignedTo,
      assignedBy,
      status,
      images,
      date
    });
    await task.save();

    // جلب بيانات المهمة بعد الحفظ مع الحقل المرجعي assignedBy
    const populatedTask = await TaskModel.findById(task._id).populate({
      path: "assignedBy",
    });

    await createNotificationsModel.create({
      assignedBy: assignedBy, // من قام بإسناد الإشعار
      assignedTo: assignedTo,
      task: task._id, // تعيين الإشعار لكل مدير
      msg: `تم استلام مهمه جديده من ${populatedTask.assignedBy.name} يرجي تنفيذها`, // الرسالة
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "خطأ في إنشاء المهمة." });
  }
};

exports.getTasks = factory.getAll(TaskModel);
exports.getOneTask = factory.getOne(TaskModel);
exports.getLoggedTask = factory.getLoggedTask(TaskModel);
exports.getLoggedTaskAssignedTo = factory.getLoggedTaskassignedTo(TaskModel);

exports.updateTask = factory.updateOne(TaskModel, "tasks");
exports.completeTask = expressAsyncHandler(async (req, res, next) => {
  const populatedTask = await TaskModel.findByIdAndUpdate(
    req.params.id,
    {
      status: "review",
    },
    { new: true }
  ).populate({
    path: "assignedBy",
  });
  await createNotificationsModel.create({
    assignedBy: populatedTask.assignedTo._id,
    assignedTo: populatedTask.assignedBy._id,
    task: populatedTask._id, // تعيين الإشعار لكل مدير
    msg: `تم اكتمال المهمه من قبل ${populatedTask.assignedTo.name} يرجي مراجعتها`,
  });
  res.status(200).json({
    status: "success",
    data: populatedTask,
  });
});
exports.rejectedTask = expressAsyncHandler(async (req, res, next) => {
  const populatedTask = await TaskModel.findByIdAndUpdate(
    req.params.id,
    {
      status: "rejected",
    },
    { new: true }
  ).populate({
    path: "assignedBy",
  });
  await createNotificationsModel.create({
    assignedBy: req.user._id,
    assignedTo: populatedTask.assignedTo._id,
    task: populatedTask._id, // تعيين الإشعار لكل مدير
    msg: ` تم مراجعه المهمه من قبل ${populatedTask.assignedBy.name} يرجي تعديلها`,
  });
  res.status(200).json({
    status: "success",
    data: populatedTask,
  });
});

exports.fulfilledTask = expressAsyncHandler(async (req, res, next) => {
  const populatedTask = await TaskModel.findByIdAndUpdate(
    req.params.id,
    {
      status: "fulfilled",
    },
    { new: true }
  ).populate({
    path: "assignedBy",
  });
  await createNotificationsModel.create({
    assignedBy: req.user._id,
    assignedTo: populatedTask.assignedTo._id,
    task: populatedTask._id, // تعيين الإشعار لكل مدير
    msg: ` تم مراجعه المهمه من قبل ${populatedTask.assignedBy.name} وتم اكتمالها`,
  });
  res.status(200).json({
    status: "success",
    data: populatedTask,
  });
});
