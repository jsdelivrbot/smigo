import { UPDATE_TURN } from '../actions/types'

const INITIAL_STATE = {
  turn: 0,
  whosTurn: 1,
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
    const whosTurn = state.whosTurn % 2 === 0 ? 1 : 2

    return { ...state, turn, whosTurn }
  }

  return state
}