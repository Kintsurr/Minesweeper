//logic
export const TILE_STATUSES = {  //tile statuses
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
}


export function createBoard (boardSize,numberOfMines) { 
    const board = []
    const MinePositions = getMinePositions(boardSize, numberOfMines)
    for(let x = 0; x < boardSize; x++){
        const row = []
        for(let y = 0; y < boardSize; y++){
            const element = document.createElement('div')
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = { //attributes and values for each tile 
                element, //div
                x, //row
                y, //column
                mine: MinePositions.some(positionMatch.bind(null,{x , y})), 
                get status(){
                    return this.element.dataset.status
                },
                set status(value){
                    return this.element.dataset.status = value
                },
            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}

export function markTile(tile){ //marking and unmarking tiles
    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status!== TILE_STATUSES.MARKED){ 
        return
    }
    if(tile.status === TILE_STATUSES.MARKED){
        tile.status = TILE_STATUSES.HIDDEN
    }else{
        tile.status = TILE_STATUSES.MARKED
    }
}


export function revealTile(board, tile){
    if(tile.status !== TILE_STATUSES.HIDDEN) {
        return 
    }
    if(tile.mine){
        tile.status = TILE_STATUSES.MINE
        return
    }
    var num
    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter(t => t.mine) //revealing multiple 
    if(mines.length === 0){
        adjacentTiles.forEach(revealTile.bind(null,board))
    }else{
        tile.element.textContent = mines.length
        num =mines. length
        if(num == 1){
            tile.element.style.color = "blue"
        }
        if(num == 2){
            tile.element.style.color = "green"
        }
        if(num == 3){
            tile.element.style.color = "red"
        }
        if(num == 4){
            tile.element.style.color = "purple"
        }
        if(num == 5){
            tile.element.style.color = "maroon"
        }
        if(num == 6){
            tile.element.style.color = "turquoise"
        }
        if(num == 7){
            tile.element.style.color = "black"
        }
        if(num == 8){
            tile.element.style.color = "pink"
        }
    }
}


export function checkWin(board) {
   return board.every(row => {
    return row.every(tile =>{
        return (tile.status === TILE_STATUSES.NUMBER || 
            (tile.mine && 
                (tile.status === TILE_STATUSES.HIDDEN || 
                    tile.status === TILE_STATUSES.MARKED))
            )
        })
    })
}

export function checkLost(board) {
    return board.some(row =>{
        return row.some(tile =>{
            return tile.status === TILE_STATUSES.MINE
        })
    })
}


function getMinePositions(boardSize, numberOfMines){ //randomize mine positions
    const positions = []

    while(positions.length < numberOfMines){
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        }
        if(!positions.some(p => positionMatch(p, position))){ //if positions aren't match that add
            positions.push(position)
        }
    }
    return positions
}


function positionMatch(a,b) { 
    return a.x === b.x && a.y === b.y
}


function randomNumber(size){
    return Math.floor(Math.random() * size)
}


function nearbyTiles(board, {x, y}) { //counting number of mines around the tile
    const tiles =[]

    for(let xOffset = -1; xOffset <= 1; xOffset++){
        for(let yOffset =-1; yOffset <= 1; yOffset++){
            const tile = board[x + xOffset]?.[y + yOffset]
          if(tile)  tiles.push(tile)
        }
    }

    return tiles
}