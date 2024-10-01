const mongoose = require("mongoose");

const createNotifications = new mongoose.Schema(
  {
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
    }, // المعين من
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
    }, // المعين إلى
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    }, // تفاصيل المهمة
    contracts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contracts",
    }, // تفاصيل المهمة
    gallery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contracts",
    }, // تفاصيل المهمة
    msg: { type: String, required: true }, // رسالة الإشعار
  },
  { timestamps: true } // لضبط التوقيتات (createdAt و updatedAt)
);
// createNotifications.pre(/^find/, function (next) {
//   this.populate({
//     path: "assignedBy",
//   }).populate({
//     path: "assignedTo",
//   });
//   next();
// });
const createNotificationsModel = mongoose.model(
  "Notifications",
  createNotifications
);
module.exports = createNotificationsModel;
