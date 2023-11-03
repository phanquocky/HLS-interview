"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/", controller.getJoke);
router.post("/jokes/:id/vote", controller.voteJoke);

/*this route use once to migrate data to database*/
// router.get("/joke", controller.postjoke);

module.exports = router;
