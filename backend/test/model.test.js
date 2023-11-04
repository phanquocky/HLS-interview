"use-strict";

const Joke = require("../models/joke");
const { expect } = require("chai");

describe("Testing Joke model", () => {
  let sampleJokeVal;

  beforeEach(() => {
    sampleJokeVal = {
      content: "random content",
      likes: 0,
      dislikes: 0,
    };
  });

  it("it should throw an error due to missing fields", async () => {
    let joke = new Joke();
    try {
      const result = await joke.validate();
    } catch (err) {
      expect(err.errors.content).to.exist;
    }
  });

  it("it should create the joke successfully with correct parameters", async () => {
    let joke = new Joke({
      ...sampleJokeVal,
    });

    expect(async () => {
      const result = await joke.validate();
    }).to.not.throw();
  });
});
