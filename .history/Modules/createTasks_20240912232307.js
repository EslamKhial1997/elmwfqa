const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    taskDuration: { type: Number, required: true }, // مدة المهمة (بالساعات أو الأيام)
    taskNotes: { type: String }, // ملحوظات إضافية
    taskImage: { type: String }, // رابط الصورة
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
    }, // الشخص المكلّف
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
    }, // الشخص الذي وزع المهمة 
    status: {
      type: String,
      enum: ["progressing", "review", "fulfilled", "rejected"],
      default: "progressing",
    }, // حالة المهمة
    show: String,
    images: [
      {
        image: String,
        // يمكنك إضافة حقول أخرى إذا كنت بحاجة إلى ذلك
      },
    ],
    reviewBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employees" }, // الشخص الذي سيراجع المهمة
    reassignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employees" }, // الشخص الذي أعيدت له المهمة
    completionDate: { type: Date }, // تاريخ إكمال المهمة
  },
  { timestamps: true }
);
const ImageURL = (doc) => {
  if (doc.images) {
    doc.images = doc.images.map((ele) => {
      if (ele.image && !ele.image.includes(`${process.env.BASE_URL}/tasks`)) {
        return {
          ...ele,
          image: `${process.env.BASE_URL}/tasks/${ele.image}`,
        };
      }
      return ele;
    });
  }
};

taskSchema.post("init", (doc) => {
  ImageURL(doc);
});

taskSchema.post("save", (doc) => {
  ImageURL(doc);
});
taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "assignedTo",
    select: "name username role",
  }).populate({ path: "assignedBy", select: "name username role" });
  next();
});

const TaskModel = mongoose.model("Task", taskSchema);
module.exports = TaskModel;
