const mongoose = require("mongoose");

const MazeSchema = new mongoose.Schema({
  rows: {
    type: Number,
    required: [true, "Please, provide the number of rows."],
    min: [2, "The number of rows must be at least greater than 1."],
    max: [100, "The number of rows must not be greater than 100."],
  },
  columns: {
    type: Number,
    required: [true, "Please, provide the number of rows."],
    min: [2, "The number of columns must be at least greater than 1."],
    max: [100, "The number of columns must not be greater than 100."],
  },
  time: {},
  mazeHTML: { type: String, required: [true, "Please, generate a maze."] },
  movement: {
    type: Array,
  },
});

module.exports = mongoose.model("Maze", MazeSchema);
