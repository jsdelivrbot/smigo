import {
  CAPTURE_GROUPS,
  CLEAR_ERRORS,
  COUNT_LIBERTIES,
  DETECT_AND_MERGE_GROUPS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  PLACE_STONE_ON_BOARD,
  UPDATE_BOARD,
  UPDATE_TURN,
} from './types'

export function login_request(username, password) {
  return {
    type: LOGIN_REQUEST,
    payload: { username, password }
  }
}

export function login_success(user) {
  return {
    type: LOGIN_SUCCESS,
    payload: { user }
  }
}

export function login_error(error) {
  return {
    type: LOGIN_ERROR,
    payload: { error }
  }
}

export function logout(token) {
  return {
    type: LOGOUT,
    payload: { token }
  }
}

export function clear_errors() {
  return {
    type: CLEAR_ERRORS,
    payload: { }
  }
}

export function placeStoneOnBoard(x, y, player) {
  return {
    type: PLACE_STONE_ON_BOARD,
    payload: { x, y, player }
  }
}

export function updateTurn() {
  return {
    type: UPDATE_TURN,
  }
}

export function updateBoard(x, y, player) {
  return {
    type: UPDATE_BOARD,
    payload: { x, y, player }
  }
}

export function detectAndMergeGroups(x, y, player) {
  return {
    type: DETECT_AND_MERGE_GROUPS,
    payload: { x, y, player }
  }
}

export function countLiberties(player) {
  return {
    type: COUNT_LIBERTIES,
    payload: { player }
  }
}

export function captureGroups(player) {
  return {
    type: CAPTURE_GROUPS,
    payload: { player }
  }
}
