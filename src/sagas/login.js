import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

import { login_success } from '../actions/index'
import { LOGIN_REQUEST, LOGIN_ERROR, LOGOUT } from '../actions/types'
import * as Api from '../api'

function* login() {
  while (true) {
    const request = yield take(LOGIN_REQUEST)
    const { username, password } = request.payload

    // fork return a Task object
    const task = yield fork(authorize, username, password)

    console.log('login saga task', task)

    const action = yield take([LOGOUT, LOGIN_ERROR])

    console.log('login saga action', action)

    if (action.type === LOGOUT) {
      yield cancel(task)
    }

    // yield call(Api.clearItem, 'token')
  }
}

function* authorize(username, password) {
  try {
    // const token = yield call(Api.authorize, username, password)
    const user = yield call(Api.authorize, username, password)

    console.log('authorize user', user)
    yield put(login_success(user))
    console.log('login success')
    // yield call(Api.storeItem, {token})
    // return token
  }
  catch(error) {
    yield put({ type: LOGIN_ERROR, error })
    console.log('login failed', error)
  }
  finally {
    if (yield cancelled()) {
      console.log('task cancelled')
      // ... put special cancellation handling code here
    }
  }
}

export default function* rootSaga() {
  yield fork(login)
}
