"use strict";

require("./database");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectToDatabase = require("./database");

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Define routes
const indexRoute = require("./routes/index");

// routes
app.use("/", indexRoute);

// check not found error
app.use((req, res, next) => {
  res.status(404).render("error: ", { message: "File not foud!" });
});

// check the internal error
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("error", { message: "Internal error" });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
