import { LOGIN_SUCCESS } from '../actions/types'

const INITIAL_STATE = {
  user: null,
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case LOGIN_SUCCESS:
    const user = action.payload.user

    console.log('reducer login success', action)

    return { ...state, user }
  }

  return state
}
