import _ from 'lodash'

import { UPDATE_BOARD, DETECT_GROUPS } from '../actions/index'

function checkVicinity(x, y, group) {
  // coordinates around stone position
  const up = `${x - 1}-${y}`
  const down = `${x + 1}-${y}`
  const left = `${x}-${y - 1}`
  const right = `${x}-${y + 1}`

  return group.includes(up) || 
          group.includes(down) ||
          group.includes(left) || 
          group.includes(right)
}

const boardSize = 9
let board = []

for(let x = 0; x < boardSize; x++) {
  board[x] = []
  for(let y = 0; y < boardSize; y++) {
    board[x][y] = null
  }
}

const INITIAL_STATE = {
  board,
  groups: {
    0: [],
    1: []
  },
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case UPDATE_BOARD:
    const { x, y, player } = action.payload

    let newBoard = [...state.board]
    newBoard[x][y] = player

    return { ...state, newBoard }
  case DETECT_GROUPS:
    let groups = { ...state.groups }

    const { x: stoneX, y: stoneY, player: currentPlayer } = action.payload

    const position = `${stoneX}-${stoneY}`

    let foundIndex = []

    // loop player's possible groups and
    // check if current stone position matches any existing groups
    const nodeGroups = state.groups[currentPlayer].filter((group, index) => {
      if (checkVicinity(stoneX, stoneY, group)) {
        foundIndex.push(index)

        groups[currentPlayer][index].push(position)

        return true
      }

      return false
    })

    if (!nodeGroups.length) {
      groups[currentPlayer].push([position])
    }

    if (foundIndex.length > 1) {

      let mergedArray = groups[currentPlayer].reduce((acc, cur, index) => {
        if (foundIndex.includes(index)) {
          acc = [...acc, cur]
        }

        return acc
      }, [])

      mergedArray = _.flatten(mergedArray)
      mergedArray = _.uniq(mergedArray)

      groups[currentPlayer] = groups[currentPlayer].filter((val, index) => {
        return !foundIndex.includes(index)
      })

      groups[currentPlayer].push(mergedArray)
    }

    return { ...state, groups }
  }

  return state
}