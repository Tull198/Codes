var totalRows = 4
var totalColumns = 4
var init = [1,1]
var timerInterval = 10

var movementHistory = []
var crossroads = []

const mazeContainer = document.getElementById('maze')


function mazeGenerator() {
    for (var row = 1; row <= totalRows; row++) {
        var newRow = document.createElement('tr')
        
        for (var column = 1; column <= totalColumns; column++) {
            var newColumn = document.createElement('td')
            newColumn.setAttribute('id', `${row},${column}`)
            newColumn.setAttribute('class', 'untaken')
            
            mazeContainer.appendChild(newColumn)
        }
        mazeContainer.appendChild(newRow)
    }
    var start = document.getElementById('1,1')
    start.setAttribute('style', 'background: green')
    var end = document.getElementById(`${totalRows},${totalColumns}`)
    end.setAttribute('style', 'background: red')
    end.setAttribute('name', 'end')

    looper(init)
}

function movementLogic(init) {
    var movement = {
        right : document.getElementById(`${init[0]},${init[1] + 1}`),
        left : document.getElementById(`${init[0]},${init[1] - 1}`),
        bottom : document.getElementById(`${init[0] + 1},${init[1]}`),
        top : document.getElementById(`${init[0] - 1},${init[1]}`)
    }

    for (option in movement) {
        if (!movement[option] || movement[option].getAttribute('class') != 'untaken') {
            delete movement[option]
        }
    }

    var next = {}// Object that saves direction and next move.
    movKeys = Object.keys(movement)
    movValues = Object.values(movement)

    var currentCellId = `${init[0]},${init[1]}`
    movKeysLength = movKeys.length

    // If more than two options, save directions and square, save init.
    if (movKeysLength > 1) {
        var chance = Math.floor(Math.random() * movKeysLength)  
        next[movKeys[chance]] = movValues[chance]
        document.getElementById(currentCellId).setAttribute('class', 'crossroad')
        crossroads.push(init)
    }

    // If only one option, save direction and square, make it 'taken'.
    else if (movKeysLength == 1) {
        next[movKeys[0]] = movValues[0]
        document.getElementById(currentCellId).setAttribute('class', 'taken')
    }

    else {
        crossroads = [... new Set(crossroads)] // Removes duplicates and taken squares
        init = crossroads.pop()
        document.getElementById(currentCellId).setAttribute('class', 'taken')
        return init

        }

    wallRemover(init, next)
    var nextId = Object.values(next)[0].id // This is first a Value, then an HTML element, then its id.
    nextId = nextId.split(',')
    init = [parseInt(nextId[0]), parseInt(nextId[1])] // Turns the id into an usable array.
    return init
}

function looper(init){
    console.time('resolve')
    while (JSON.stringify(init) != `[${totalRows},${totalColumns}]`) {
        movementHistory.push(init)
        var init = movementLogic(init)
    }

    while (document.getElementsByClassName('untaken')[0]) {
        crossroads = []
        init
        
        leftOver = document.getElementsByClassName('untaken')[0].id.split(',')
        leftOver = [parseInt(leftOver[0]), parseInt(leftOver[1])]

        var movement = [
            document.getElementById(`${leftOver[0]},${leftOver[1] + 1}`),
            document.getElementById(`${leftOver[0]},${leftOver[1] - 1}`),
            document.getElementById(`${leftOver[0] + 1},${leftOver[1]}`),
            document.getElementById(`${leftOver[0] - 1},${leftOver[1]}`)
        ]

        for (mov in movement) {
            if (movement[mov] && movement[mov].getAttribute('class') == 'crossroad') {
                var option = movement[mov].id
                option = option.split(',')
                init = [parseInt(option[0]), parseInt(option[1])]
            }
        }
        
        while (init) {
            try {
                init = movementLogic(init)
            } catch {
                //This prevents getting out of the loop when the last square is taken.
            }
        }}
    console.timeEnd('resolve')

}

function wallRemover(init, next) {
    prevCell = document.getElementById(`${init[0]},${init[1]}`)
    nextCell = Object.values(next)[0]
    nextKey = Object.keys(next)[0]
    switch (nextKey) {
        case 'right':
            prevCell.style['border-right'] = 'none'
            nextCell.style['border-left'] = 'none'
            break
        case 'left':
            prevCell.style['border-left'] = 'none'
            nextCell.style['border-right'] = 'none'
            break
        case 'bottom':
            prevCell.style['border-bottom'] = 'none'
            nextCell.style['border-top'] = 'none'
            break
        case 'top':
            prevCell.style['border-top'] = 'none'
            nextCell.style['border-bottom'] = 'none'
            break
    }
}

function timer () {
    const colourChanger = setInterval(() => {
        movementHistory = [... new Set(movementHistory)] // Removes duplicates
        if (movementHistory.length > 0) {
            var marking = movementHistory.shift()
            marking = document.getElementById(`${marking[0]},${marking[1]}`)
            marking.style['background'] = 'rgb(250, 250, 250)'
        }
        else {
            clearInterval(colourChanger)
        }
        }, timerInterval)
}


