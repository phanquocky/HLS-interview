"use strict";

require("./database");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Define routes
const indexRoute = require("./routes/jokeRoute");

// routes
app.use("/", indexRoute);

// check not found error
app.use((req, res, next) => {
  console.log("hello oke ");
  res.status(404).render("error", { message: "File not foud!" });
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

module.exports = app;
