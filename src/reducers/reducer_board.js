import _ from 'lodash'

import { UPDATE_BOARD, DETECT_AND_MERGE_GROUPS } from '../actions/index'

function vicinities(x, y) {
  return {
    up: `${x - 1}-${y}`,
    down: `${x + 1}-${y}`,
    left: `${x}-${y - 1}`,
    right: `${x}-${y + 1}`,
  }
}

function checkVicinity(x, y, group) {
  // coordinates around stone position
  const vicinity = vicinities(x, y)

  return group.includes(vicinity.up) || 
          group.includes(vicinity.down) ||
          group.includes(vicinity.left) || 
          group.includes(vicinity.right)
}

function mergeGroups(indexes, groups, player) {
  if (indexes.length < 2) {
    return groups
  }

  // gather up arrays which needs to be merged
  let mergedArray = groups[player].reduce((acc, cur, index) => {
    if (indexes.includes(index)) {
      acc = [...acc, cur]
    }

    return acc
  }, [])

  mergedArray = _.flatten(mergedArray) // e.g. ["0-0", "0-1", "0-2", "0-1"]
  mergedArray = _.uniq(mergedArray) // e.g. ["0-0", "0-1", "0-2"]

  // remove arrays from original set which were merged and flattened
  // we want only arrays that were not in indexes array
  groups[player] = groups[player].filter((val, index) => {
    return !indexes.includes(index)
  })

  // push new merged and flattened array to player's groups
  groups[player].push(mergedArray)

  return groups
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
  case DETECT_AND_MERGE_GROUPS:
    let groups = { ...state.groups }

    const { x: stoneX, y: stoneY, player: currentPlayer } = action.payload

    const position = `${stoneX}-${stoneY}`

    let foundIndex = []

    // loop player's possible groups and
    // check if current stone position matches any existing groups
    const nodeGroups = groups[currentPlayer].filter((group, index) => {
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

    groups = mergeGroups(foundIndex, groups, currentPlayer)

    return { ...state, groups }
  }

  return state
}