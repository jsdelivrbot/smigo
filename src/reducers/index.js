import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import GameReducer from './reducer_game'
import BoardReducer from './reducer_board'
import LoginReducer from './reducer_login'

const rootReducer = combineReducers({
  game: GameReducer,
  board: BoardReducer,
  login: LoginReducer,
  router: routerReducer,
})

export default rootReducer
