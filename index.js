require("dotenv").config();
// * Importing the essential libraries for the application
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const verifyToken = require("./middlewares/tokenVerify");

const authRoutes = require("./controllers/authController");
const accountRoutes = require("./controllers/accountController");
const transactionRoutes = require("./controllers/transactionController");
const adminRoutes = require("./controllers/adminController");

// * Initializing the express application
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// * MongoDB connection to local server
mongoose
  .connect("mongodb://localhost:27017/myfin_banking_app")
  .then(() =>
    console.log("MongoDB connection has been successfully established")
  )
  .catch((error) => console.log("error occured: ", error.message));

// Todo: all the routes should be listed below

app.use("/api/auth", authRoutes);
app.use("/api/account", verifyToken, accountRoutes);
app.use("/api/transaction", verifyToken, transactionRoutes);
app.use("/api/admin", verifyToken, adminRoutes);

// * Starting the express server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log("Server is running on the port: ", port);
});
