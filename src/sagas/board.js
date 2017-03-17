import { fork, takeEvery, put } from 'redux-saga/effects'

import { PLACE_STONE_ON_BOARD } from '../actions/types'
import { 
  updateBoard,
  detectAndMergeGroups,
  countLiberties,
  captureGroups,
  updateTurn,
} from '../actions/index'

function* placeStone() {
  yield takeEvery(PLACE_STONE_ON_BOARD, placeStoneOnBoard)
}

function* placeStoneOnBoard({ payload: { x, y, player }}) {
  yield put(updateBoard(x, y, player))
  yield put(detectAndMergeGroups(x, y, player))
  yield put(countLiberties(player))
  yield put(captureGroups(player))
  yield put(updateTurn())
}

export default function* rootSaga() {
  yield fork(placeStone)
}