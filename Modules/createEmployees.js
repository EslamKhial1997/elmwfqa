const mongoose = require("mongoose");

const createEmployees = new mongoose.Schema(
  {
    name: {
      required: [true, "Name Is Required"],
      type: String,
    },
    identity: String,
    username: String,
    password: String,
    phone: String,
    role: {
      type: String,
      enum: ["manager", "accountant", "supervisor", "marketer"],
      default: "marketer",
    },
   
  },
  { timestamps: true }
);

const createEmployeesModel = mongoose.model("Employees", createEmployees);
module.exports = createEmployeesModel;
