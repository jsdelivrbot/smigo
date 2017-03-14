import { combineReducers } from 'redux'

import GameReducer from './reducer_game'
import BoardReducer from './reducer_board'

const rootReducer = combineReducers({
  game: GameReducer,
  board: BoardReducer,
})

export default rootReducer
