import { UPDATE_TURN } from '../actions/index'

const boardSize = 9
let board = []

for(let x = 0; x < boardSize; x++) {
  board[x] = []
  for(let y = 0; y < boardSize; y++) {
    board[x][y] = null
  }
}


const INITIAL_STATE = {
  turn: 0,
  whosTurn: 0,
  board,
  players: {
    "player1": {
      color: "#000"
    },
    "player2": {
      color: "#fff"
    }
  },
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case UPDATE_TURN:
    const turn = state.turn + 1
    const whosTurn = state.whosTurn ? 0 : 1

    let newBoard = state.board
    const { x, y } = action.payload

    newBoard[x][y] = whosTurn

    return { ...state, turn, whosTurn, board: newBoard }
  }

  return state
}