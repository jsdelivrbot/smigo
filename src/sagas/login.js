import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

import { login_success, login_error } from '../actions/index'
import { LOGIN_REQUEST, LOGIN_ERROR, LOGOUT } from '../actions/types'
import * as Api from '../api'

function* login() {
  while (true) {
    const request = yield take(LOGIN_REQUEST)
    const { username, password } = request.payload

    // fork return a Task object
    const task = yield fork(authorize, username, password)

    const action = yield take([LOGOUT, LOGIN_ERROR])

    if (action.type === LOGOUT) {
      yield cancel(task)
    }

    // returned value in task.result()
    yield call(Api.clearItem, username)
  }
}

function* authorize(username, password) {
  try {
    const [user, id] = yield call(Api.authorize, username, password)

    const { response, error } = yield call(Api.saveToken, id, user.token)

    if (error) {
      throw error

      return false
    }

    yield fork(Api.storeItem, username, user.token)

    yield put(login_success(user))

    // return id
  }
  catch(error) {
    yield put(login_error(error))
  }
  finally {
    if (yield cancelled()) {
      // ... put special cancellation handling code here
    }
  }
}

export default function* rootSaga() {
  yield fork(login)
}
