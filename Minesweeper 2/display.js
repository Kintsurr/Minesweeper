//Display/UI

// 1. populate a board with tiles/mines
import { TILE_STATUSES, 
        createBoard, 
        markTile, 
        revealTile, 
        checkLost, 
        checkWin,
} from "./interactivity.js";

const BOARD_SIZE = 16
const NUMBER_OF_MINES = 40


const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES) //importing main function from interactivity.js
const boardElement = document.querySelector('.board') 
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext")
const ele = document.getElementById('timer');

board.forEach(row => {   //attaching main function to board 
    row.forEach(tile =>{
    boardElement.append(tile.element)
    tile.element.addEventListener('click', () =>{
        revealTile(board, tile)
        checkGameEnd()
        })
    tile.element.addEventListener('contextmenu', e =>{
        e.preventDefault()
        markTile(tile)
        listMinesLeft()
        })
    })
})


boardElement.style.setProperty('--size', BOARD_SIZE)  
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
        const markedTilesCount = board.reduce((count, row) => {
                return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        }, 0)
        minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}
var timer = 0;
var active = true;
(function(){
        if(active == true){
        var sec = 1;
        timer = setInterval(()=>{
                ele.innerHTML = sec;
                sec++;
        }, 1000)   
}     
})();

function checkGameEnd(){
        const win = checkWin(board)
        const lose = checkLost(board)

        if(win || lose) {
                boardElement.addEventListener('click', stopProp, {capture: true})
                boardElement.addEventListener('contextmenu', stopProp, {capture: true})
                clearInterval(timer);
        }
        if(win){
                messageText.textContent = "You Win"
        } 
        if(lose){
                messageText.textContent = "You Lose"
                board.forEach(row =>{
                        row.forEach(tile =>{
                                if(tile.status === TILE_STATUSES.MARKED) markTile(tile)
                                if(tile.mine) revealTile(board, tile)
                        })
                })
        }
}
function stopProp(e) {
        e.stopImmediatePropagation()
}
