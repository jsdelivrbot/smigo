import {
  CAPTURE_GROUPS,
  COUNT_LIBERTIES,
  DETECT_AND_MERGE_GROUPS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
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

export function logout(id) {
  return {
    type: LOGOUT,
    payload: { id }
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
