import { fork } from 'redux-saga/effects'

import board from './board'
import login from './login'

export default function* rootSaga() {
  yield fork(board)
  yield fork(login)
}
