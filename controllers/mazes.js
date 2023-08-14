const Maze = require("../models/Maze.js");

const postMaze = async (req, res) => {
  try {
    const maze = await Maze.create(req.body);
    res.status(200).json(maze);
  } catch (error) {
    const { message: errorMessage } = error;
    res.status(401).json(errorMessage); // Error will tell you if you need to input rows/columns, or generate a maze.
  }
};

const getAllMazes = async (req, res) => {
  try {
    const mazes = await Maze.find({});
    if (mazes.length == 0) {
      res.status(500).send();
    } else {
      res.status(200).json({ mazes });
    }
  } catch {
    res.status(404).send();
  }
};

const getMaze = async (req, res) => {
  const { id: mazeID } = req.params;
  try {
    const maze = await Maze.findById({ _id: mazeID });
    if (!maze) {
      res.status(404).send();
      return;
    }
    res.status(200).json(maze);
  } catch {
    res.status(500).send();
  }
};

module.exports = { postMaze, getAllMazes, getMaze };
