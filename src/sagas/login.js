import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

import { login_success, login_error, getLoggedUsers, userListRequest } from '../actions/index'
import { LOGIN_REQUEST, LOGIN_ERROR, LOGOUT, USER_LIST_REQUEST } from '../actions/types'
import * as Api from '../api'

function* login() {
  while (true) {
    const request = yield take(LOGIN_REQUEST)
    const { email, password } = request.payload

    // fork return a Task object
    const task = yield fork(authorize, email, password)

    const action = yield take([LOGOUT, LOGIN_ERROR])

    if (action.type === LOGOUT) {
      yield cancel(task)
    }

    yield fork(Api.clearItem, 'token')
    // returned value in task.result()
    // remove token from db
    yield call(Api.saveToken, task.result(), '')
    yield put(userListRequest())
  }
}

function* authorize(email, password) {
  try {
    const userResponse = yield call(Api.getUser, email, password)

    let user = userResponse[0]
    const id = user._id

    const token = yield call(Api.generateToken, id)
    const { response, error } = yield call(Api.saveToken, id, token)

    if (error) {
      throw error

      return false
    }

    user.token = token

    yield fork(Api.storeItem, 'token', token)
    yield put(login_success(user))

    return id
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

function* loggedUsers() {
  while(true) {
    const request = yield take(USER_LIST_REQUEST)

    try {
      const users = yield call(Api.getUsers)
      yield put(getLoggedUsers(users))
    }
    catch(error) {
      console.log('error in fetching logged users', error)
    }
  }
}

export default function* rootSaga() {
  yield fork(login)
  yield fork(loggedUsers)
}
