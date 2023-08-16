// This script will generate a maze and display it. It basically makes a table element that is
// essentially a grid, separated by cells. A path is randombly found from the top left corner to
// the bottom right one and as the program moves throughout the table it removes the corresponding borders that give
// the appearance of a continous path. This is done until it reaches the end.
// After that, the program sets out to fill in the paths not taken that represent dead-ends.
// This means that the program has already "solved" the maze before even generating it, it
// just builds around the main path taken to the end to give the table the typical maze look.
// This is necessary to assure that every maze has at least one solution, and not just a random
// jumble of disjointed paths.
// The final touch to make the table look look good, is styling it with "border-collapsed: collapsed".

var init = [1, 1]; //Initial position, it is the top left corner of the maze, or the green square.

function mazeGenerator() {
  globalThis.movementHistory = []; //Stores explored cells.
  globalThis.crossroads = []; //Stores explored cells where there was more than 1 possible move.
  globalThis.totalRows = Number(document.getElementById("rows").value);
  globalThis.totalColumns = Number(document.getElementById("columns").value);

  //Limits rows from 2 to 100
  if (totalRows < 2 || totalRows > 100) {
    window.alert("Row numbers must be between 2 and 100.");
    return;
  }
  //Limits columns from 2 to 100
  if (totalColumns < 2 || totalColumns > 100) {
    window.alert("Column numbers must be between 2 and 100.");
    return;
  }

  const mazeContainer = document.getElementById("mazeContainer");
  const body = document.querySelector("body");

  mazeContainer.remove();

  // It may seem extreme to remove so much HTML just to create the elements just after.
  // I used maze.innerHTML = "" before, which would save us this trouble, but this would
  // cause a strange bug when the table element has "border-collapse: collapse" in its styling and it was removed,
  // it left rendered a "ghost line" from the last row of the previous table that stayed on the screen, and would
  // disappeared by itself after any element in index.html was changed, as, e.g., when a hover effect
  // is activated. Because of this reason and after many failed work-arounds, I decided to just
  // remove the entire parent div and make it from scratch. It's not an ideal solution, but it works.

  const newMazeContainer = document.createElement("div");
  newMazeContainer.setAttribute("id", "mazeContainer");
  body.appendChild(newMazeContainer);
  const maze = document.createElement("table");
  maze.setAttribute("id", "maze");

  newMazeContainer.appendChild(maze);

  // An arbitrary way to define the size of the cells on the screen, based on its dimensions.
  // It assures that they will display as squares.
  if (totalRows < totalColumns) {
    var cellSize = 75 / totalColumns;
  } else {
    var cellSize = 75 / totalRows;
  }
  // Generates the necessary HTML table elements and appends them to the table.
  for (var row = 1; row <= totalRows; row++) {
    var newRow = document.createElement("tr");

    for (var column = 1; column <= totalColumns; column++) {
      var newColumn = document.createElement("td");
      newColumn.setAttribute("id", `${row},${column}`);
      newColumn.setAttribute("class", "untaken");
      newColumn.setAttribute(
        "style",
        `width: ${cellSize}vh; height: ${cellSize}vh`
      );

      maze.appendChild(newColumn);
    }
    maze.appendChild(newRow);
  }

  // Colours the start and the end to their respective colours.
  const start = document.getElementById("1,1");
  start.setAttribute("style", "background: rgb(128, 169, 0)");
  const end = document.getElementById(`${totalRows},${totalColumns}`);
  end.setAttribute("style", "background: rgb(199, 32, 0)");
  end.setAttribute("name", "end");

  mazeMaster(init);
}

// The main function that generates the maze. It explores the table created and fids a path
// from the start to the end with the help of movementLogic and the first 'while' loop.
// The second 'while' loop is used to remove the paths that will lead to dead-ends,
// it is basically the same process, but modified to assure that no cell is left untouched.
function mazeMaster(init) {
  while (JSON.stringify(init) != `[${totalRows},${totalColumns}]`) {
    movementHistory.push(init);
    var init = movementLogic(init);
  }

  while (document.getElementsByClassName("untaken")[0]) {
    crossroads = []; // Removes previous entries of crossroads.
    init;

    // Left overs are the cells that have not been explored yet, and are "untaken".
    // This two next lines get the id of the first cell that is untaken and removes
    // the coma in order to obtain a string with only two numbers, which are then parsed
    // as two numbers of an array so that we can explore the possible moves
    // of adjacent cells, with respect to the untaken cell.
    leftOver = document.getElementsByClassName("untaken")[0].id.split(",");
    leftOver = [parseInt(leftOver[0]), parseInt(leftOver[1])];

    // explores the adjacent possibilities.
    var movement = [
      document.getElementById(`${leftOver[0]},${leftOver[1] + 1}`),
      document.getElementById(`${leftOver[0]},${leftOver[1] - 1}`),
      document.getElementById(`${leftOver[0] + 1},${leftOver[1]}`),
      document.getElementById(`${leftOver[0] - 1},${leftOver[1]}`),
    ];

    // If one of the adjacent cells is a possible crossroad,
    // move to the first one that satisfies said condition.
    for (mov in movement) {
      if (movement[mov] && movement[mov].getAttribute("class") == "crossroad") {
        var option = movement[mov].id;
        option = option.split(",");
        init = [parseInt(option[0]), parseInt(option[1])];
      }
    }

    // If a crossroad exists, go there. If not, there are not more crossroads, the maze has been explored.
    while (init) {
      try {
        init = movementLogic(init);
      } catch {
        //This prevents getting out of the loop when the last square is taken, as there won't be a next square to move on to.
      }
    }
  }
  // Save a copy of the maze before editing it with timer().
  globalThis.mazeDB = document.getElementById("maze").innerHTML;
  movesDB = [...new Set(movementHistory)];
}

function movementLogic(init) {
  // Explores sorrunding cells in a key-value format. The keys are important
  // As they show the direciton of the movement. This information is later
  // used to remove the walls, or the border, of the cells of the table
  // to give the maze its characteristic look.
  var movement = {
    right: document.getElementById(`${init[0]},${init[1] + 1}`),
    left: document.getElementById(`${init[0]},${init[1] - 1}`),
    bottom: document.getElementById(`${init[0] + 1},${init[1]}`),
    top: document.getElementById(`${init[0] - 1},${init[1]}`),
  };

  // Remove from "movement" the cells that are not untaken or that return "undefined".
  // This last case will only happen when we are dealing with cells that make up the border.
  for (option in movement) {
    if (
      !movement[option] ||
      movement[option].getAttribute("class") != "untaken"
    ) {
      delete movement[option];
    }
  }

  var next = {}; // Object that saves direction and next move.
  movKeys = Object.keys(movement);
  movValues = Object.values(movement);

  var currentCellId = `${init[0]},${init[1]}`;
  movKeysLength = movKeys.length;

  // If there are more than two options of movement, choose one randombly.
  // This option will be the next cell to explore, and the current one will be marked
  // as a crossroad, as their possibilities will necessarily have to be exhausted in order
  // for the maze to be completely generated, and therefore will have to be explored
  // many times.
  if (movKeysLength > 1) {
    var chance = Math.floor(Math.random() * movKeysLength);
    next[movKeys[chance]] = movValues[chance];
    document.getElementById(currentCellId).setAttribute("class", "crossroad");
    crossroads.push(init);
  }

  // If only one option available, save direction and cell, mark it as 'taken'.
  else if (movKeysLength == 1) {
    next[movKeys[0]] = movValues[0];
    document.getElementById(currentCellId).setAttribute("class", "taken");

    // If no options available, go to the previous crossroad encountered once again.
  } else {
    crossroads = [...new Set(crossroads)]; // Removes duplicates and taken squares
    init = crossroads.pop();
    document.getElementById(currentCellId).setAttribute("class", "taken");
    return init;
  }

  // After every choice is taken, wallRemover will take the current cell and the next one,
  // since we have saved the direction, we know which walls to remove.
  wallRemover(init, next);
  var nextId = Object.values(next)[0].id; // This is first a Value, then an HTML element, then its id.
  nextId = nextId.split(",");
  init = [parseInt(nextId[0]), parseInt(nextId[1])]; // Turns the id into an usable array.
  return init; // Redefine init, so that the 'while' loop can continue.
}

function wallRemover(init, next) {
  prevCell = document.getElementById(`${init[0]},${init[1]}`);
  nextCell = Object.values(next)[0];
  nextKey = Object.keys(next)[0];
  // Table cells have two adjacent opposite borders, both of them have to be removed.
  switch (nextKey) {
    case "right":
      prevCell.style["border-right"] = "none";
      nextCell.style["border-left"] = "none";
      break;
    case "left":
      prevCell.style["border-left"] = "none";
      nextCell.style["border-right"] = "none";
      break;
    case "bottom":
      prevCell.style["border-bottom"] = "none";
      nextCell.style["border-top"] = "none";
      break;
    case "top":
      prevCell.style["border-top"] = "none";
      nextCell.style["border-bottom"] = "none";
      break;
  }
}

function timer() {
  totalCells = totalColumns * totalRows; // An arbitrary way to define the speed on which the path is highlighted.
  if (totalCells <= 30) {
    var timerInterval = 200;
  } else if (totalCells <= 60) {
    var timerInterval = 90;
  } else if (totalCells <= 100) {
    var timerInterval = 50;
  } else {
    var timerInterval = 10;
  }
  cellsToColour = [...new Set(movementHistory)]; // Removes duplicates

  const genMazeButton = document.getElementById("generateMaze");
  genMazeButton.addEventListener("click", () => {
    clearInterval(colourChanger);
  });
  //This function sets the timer in which the cells explored will be highlighted
  const colourChanger = setInterval(() => {
    if (cellsToColour.length > 0) {
      var marking = cellsToColour.shift();
      marking = document.getElementById(`${marking[0]},${marking[1]}`);
      marking.style["background"] = "rgba(200, 200, 200, 0.5)";
    } else {
      marking = document.getElementById(`${totalRows},${totalColumns}`);
      marking.style["background"] = "rgb(92, 122, 192)";
      clearInterval(colourChanger);
    }
  }, timerInterval);
}

//Uploads maze and movements taken to database.
async function saveMaze() {
  try {
    // Removes duplicate
    await axios.post("/api/v1/mazes", {
      rows: totalRows,
      columns: totalColumns,
      time: new Date().toDateString(),
      mazeHTML: mazeDB,
      movement: movesDB,
    });
  } catch {
    window.alert("You must generate a maze first.");
  }
}
