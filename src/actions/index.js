export const UPDATE_TURN = 'UPDATE_TURN'
export const UPDATE_BOARD = 'UPDATE_BOARD'

export function updateTurn() {
  return {
    type: UPDATE_TURN,
  }
}

export function updateBoard(x, y, player) {
  return {
    type: UPDATE_BOARD,
    payload: { x, y, player }
  }
}