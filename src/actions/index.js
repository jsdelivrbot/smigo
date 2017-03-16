import {
  UPDATE_TURN,
  UPDATE_BOARD,
  DETECT_AND_MERGE_GROUPS,
  COUNT_LIBERTIES,
  CAPTURE_GROUPS,
} from './types'

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