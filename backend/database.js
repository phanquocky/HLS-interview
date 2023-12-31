"use strict";

require("dotenv").config();
const mongoose = require("mongoose");

const URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;

const connect = (uri) => {
  mongoose
    .connect(uri, {
      dbName: DB_NAME,
    })
    .then((res) => console.log(`Connection DB Succesful...`))
    .catch((err) => console.log(`Error in DB connection`, err));
};

module.exports = connect(URI);
