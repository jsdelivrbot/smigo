import { LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT, CLEAR_ERRORS } from '../actions/types'

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
  }

  return state
}
