async function getAllMazes() {
  const listDOM = document.getElementById("list");
  try {
    const {
      data: { mazes },
    } = await axios.get("/api/v1/mazes/list");
    const list = mazes.reverse();
    const listHTML = list
      .map((maze) => {
        const { rows, columns, time, _id: mazeID } = maze;
        const total = rows * columns;
        return `
            <a id="listRow" href="singleMaze.html?id=${mazeID}">
            <p id="listItem">${rows} x ${columns}</p>
            <p id="listItem">Total cells: ${total}</p>
            <p id="listItem">${time}</p>
          </a>`;
      })
      .join("");
    listDOM.innerHTML =
      `<div id='listHeader'>
          <p id='listItem'>Dimension</p>
          <p id='listItem'>Number of Cells</p>
          <p id='listItem'>Date added</p></div>` + listHTML;
  } catch (error) {
    window.alert(error);
  }
}

getAllMazes();
