import { fork } from 'redux-saga/effects'

import board from './board'

export default function* rootSaga() {
  yield fork(board)
}