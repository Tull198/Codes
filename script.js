var totalRows = 3
var totalColumns = 3

const mazeContainer = document.getElementById('maze')

function mazeGenerator() {
    for (var row = 1; row <= totalRows; row++) {
        var newRow = document.createElement('tr')

        for (var column = 1; column <= totalColumns; column++) {
            var newColumn = document.createElement('td')
            newColumn.setAttribute("id", `(r${row}, c${column})`)
            mazeContainer.appendChild(newColumn)
        }

        mazeContainer.appendChild(newRow)
    }

    let start = document.getElementById('(r1, c1)')
    start.setAttribute('style', 'background: green')

    let end = document.getElementById(`(r${totalRows}, c${totalColumns})`)
    end.setAttribute('style', 'background: red')

    console.log(document.querySelectorAll('td')[0].id)
}

mazeGenerator()