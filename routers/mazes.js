const express = require("express");
const router = express.Router();
const { postMaze, getAllMazes, getMaze } = require("../controllers/mazes.js");

router.route("/").post(postMaze);
router.route("/list").get(getAllMazes);
router.route("/:id").get(getMaze);

module.exports = router;
