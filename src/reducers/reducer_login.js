import {
  CLEAR_ERRORS,
  GET_LOGGED_USERS,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
} from '../actions/types'

const INITIAL_STATE = {
  user: null,
  error: null,
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case LOGIN_SUCCESS:
    const { user } = action.payload

    return { ...state, user }
  case LOGIN_ERROR:
    const { error } = action.payload

    return { ...state, user: null, error }
  case LOGOUT:
    return { ...state, user: null, error: null }
  case CLEAR_ERRORS:
    return { ...state, error: null }
  case GET_LOGGED_USERS:
    const { users } = action.payload

    return { ...state, users }
  }

  return state
}
