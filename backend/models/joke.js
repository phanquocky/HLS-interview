const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jokeSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
});

const Joke = mongoose.model("jokes", jokeSchema);

module.exports = Joke;
