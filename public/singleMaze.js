const getSingleMaze = async () => {
  const params = window.location.search;
  const id = new URLSearchParams(params).get("id");
  const table = document.getElementById("maze");
  try {
    const { data: mazes } = await axios.get(`/api/v1/mazes/${id}`);
    const { rows, columns, movement, mazeHTML } = mazes;
    table.innerHTML = mazeHTML;
    globalThis.totalRows = rows;
    globalThis.totalColumns = columns;
    globalThis.movementHistory = movement;
  } catch (error) {
    loadingText.innerHTML = "Database is not connected or empty...";
    window.alert(error);
  }
};

getSingleMaze();
