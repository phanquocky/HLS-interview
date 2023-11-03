"use strict";

const express = require("express");
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
const indexRoute = require("./routes/index");
const usersRoute = require("./routes/users");

// check not found error
app.use((req, res, next) => {
  res.status(404).render("error: ", { message: "File not foud!" });
});

// check the internal error
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("error", { message: "Internal error" });
});

app.use("/", indexRoute);
app.use("/users", usersRoute);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
