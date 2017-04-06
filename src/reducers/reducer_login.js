import { LOGIN_SUCCESS, LOGOUT } from '../actions/types'

const INITIAL_STATE = {
  user: null,
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case LOGIN_SUCCESS:
    const user = action.payload.user

    return { ...state, user }
  case LOGOUT:
    console.log('logout reducer')
    return { ...state, user: null }
  }

  return state
}
