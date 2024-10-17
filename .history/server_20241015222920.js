const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbCollection = require("./Config/config");
const globalError = require("./Middleware/globalError");
const RoutesAuth = require("./Routes/RoutesAuth");
const RoutesUser = require("./Routes/RoutesUsers");
const RoutesEmployees = require("./Routes/RoutesEmployees");
const RoutesGallery = require("./Routes/RoutesGallerys");
const RoutesTask = require("./Routes/RoutesTasks");
const RoutesPermission = require("./Routes/RoutesPermission");
const RoutesCart = require("./Routes/RoutesCarts");
const RoutesContracts = require("./Routes/RoutesContracts");
const RoutesDocument = require("./Routes/RoutesDocuments");
const RoutesNotification = require("./Routes/RoutesNotification");
const ApiError = require("./Resuble/ApiErrors");
const path = require("path");
const { createFirstManagerAccount } = require("./Services/EmployeesService");

const app = express();
app.use(express.json());
const uploadsPath = path.join(__dirname, "../uploads");
app.use(express.static(uploadsPath));
dotenv.config({ path: "config.env" });
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
dbCollection();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());c

app.use("/api/v1/auth", RoutesAuth);
app.use("/api/v1/user", RoutesUser);
app.use("/api/v1/employees", RoutesEmployees);
app.use("/api/v1/gallery", RoutesGallery);
app.use("/api/v1/task", RoutesTask);
app.use("/api/v1/permission", RoutesPermission);
app.use("/api/v1/cart", RoutesCart);
app.use("/api/v1/contracts", RoutesContracts);
app.use("/api/v1/document", RoutesDocument);
app.use("/api/v1/notification", RoutesNotification);
createFirstManagerAccount();
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  if (!req.originalUrl.startsWith("/api")) {
    9
  } else {
    res.status(404).json({ message: "API endpoint not found" });
  }
});
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listen on the ${PORT}`);
});
app.all("*", (req, res, next) => {
  next(new ApiError(`Sorry This URL ${req.originalUrl} does not exist`, 400));
});
app.use(globalError);
