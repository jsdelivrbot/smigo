export const UPDATE_TURN = 'UPDATE_TURN'

export function updateTurn(x, y) {
  return {
    type: UPDATE_TURN,
    payload: { x, y }
  }
}