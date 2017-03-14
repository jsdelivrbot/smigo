import { UPDATE_BOARD } from '../actions/index'

const boardSize = 9
let board = []

for(let x = 0; x < boardSize; x++) {
  board[x] = []
  for(let y = 0; y < boardSize; y++) {
    board[x][y] = null
  }
}

const INITIAL_STATE =  board

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case  UPDATE_BOARD:
    let newBoard = state
    const { x, y, player } = action.payload

    newBoard[x][y] = player

    return newBoard
  }

  return state
}