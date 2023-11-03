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
      res.status(404).json({ message: "No more jokes available" }); // TODO: handle error
    } else {
      const jokeId = joke._id;

      // Set a cookie to track the user's vote for this joke
      res.cookie(`${jokeId}`, "voted", {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
        httpOnly: true,
      });

      res.json({ id: jokeId, joke: joke });
    }
  } catch (error) {
    console.error("Error retrieving random joke:", error);
    res.status(500).json({ error: "Failed to retrieve random joke" });
  }
};

controller.voteJoke = async (req, res) => {
  try {
    const jokeId = req.params.id;
    const voteType = req.body.voteType;

    // Check if the user has already voted for this joke
    const hasVoted = req.cookies[`joke_${jokeId}`];

    if (hasVoted) {
      res
        .status(400)
        .json({ message: "You have already voted for this joke." });
    } else {
      // Update the vote count for the joke
      const update = { $inc: { [voteType]: 1 } };
      const updatedJoke = await Joke.findByIdAndUpdate(jokeId, update, {
        new: true,
      });

      // Set a cookie to track the user's vote for this joke
      res.cookie(`joke_${jokeId}`, "voted", {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
        httpOnly: true,
      });

      res.json(updatedJoke);
    }
  } catch (error) {
    console.error("Error voting for joke:", error);
    res.status(500).json({ error: "Failed to vote for joke" });
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
