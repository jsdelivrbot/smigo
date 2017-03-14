import { UPDATE_TURN } from '../actions/index'

const INITIAL_STATE = {
  turn: 0,
  whosTurn: 0,
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

    return { ...state, turn, whosTurn }
  }

  return state
}