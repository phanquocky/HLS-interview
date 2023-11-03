"use strict";

const mongoose = require("mongoose");
const Joke = require("../models/joke");
const data = require("../migration/jokes");
const controller = {};

controller.getJoke = async (req, res) => {
  try {
    const votedJokes = [];
    // Get the list of voted joke IDs with valid objectId type from the cookies
    for (const cookieName in req.cookies) {
      if (mongoose.Types.ObjectId.isValid(cookieName)) {
        votedJokes.push(cookieName);
      }
    }

    const joke = await Joke.findOne({ _id: { $nin: votedJokes } });

    if (!joke) {
      res.status(404).render("error", {
        errorMessage: "That's all the jokes for today! Come back another day!",
      });
    } else {
      const jokeId = joke._id;
      res.render("joke", { joke: joke.content, id: jokeId });
    }
  } catch (error) {
    console.error("Error retrieving random joke:", error);
    res.status(500).render("error", { errorMessage: "Internal server error!" });
  }
};

controller.voteJoke = async (req, res) => {
  try {
    let jokeId = req.params.id;
    const voteType = req.body.voteType;

    if (voteType != "likes" && voteType != "dislikes")
      throw new Error("Failed to vote for joke");

    // Check if the user has already voted for this joke
    const hasVoted = req.cookies[`${jokeId}`];

    if (hasVoted) {
      res.status(400).render("error", {
        errorMessage: "You have already voted for this joke.",
      });
    } else {
      // Update the vote count for the joke
      const update = { $inc: { [voteType]: 1 } };
      const updatedJoke = await Joke.findByIdAndUpdate(jokeId, update, {
        new: true,
      });

      // Set a cookie to track the user's vote for this joke
      res.cookie(`${jokeId}`, "voted", {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
        httpOnly: true,
      });

      return res.redirect("/");
    }
  } catch (error) {
    console.error("Error voting for joke:", error);
    res
      .status(500)
      .render("error", { errorMessage: "Failed to vote for joke" });
  }
};

// this controller use only once
controller.postjoke = async (req, res) => {
  try {
    const insertedJokes = await Joke.insertMany(data);

    res.status(201).json(insertedJokes);
  } catch (error) {
    console.error("Error inserting jokes:", error);
    res.status(500).json({ error: "Failed to insert jokes" });
  }
};

module.exports = controller;
