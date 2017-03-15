export const UPDATE_TURN = 'UPDATE_TURN'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const DETECT_GROUPS = 'DETECT_GROUPS'

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

export function detectGroups(x, y, player) {
  return {
    type: DETECT_GROUPS,
    payload: { x, y, player }
  }
}
