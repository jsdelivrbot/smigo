import _ from 'lodash'

import { UPDATE_BOARD, DETECT_AND_MERGE_GROUPS } from '../actions/index'

const vicinities = (x, y) => {
  return {
    up: `${x}-${y - 1}`,
    down: `${x}-${y + 1}`,
    left: `${x - 1}-${y}`,
    right: `${x + 1}-${y}`,
  }
}

const checkVicinity = (x, y, group) => {
  // coordinates around stone position
  const vicinity = vicinities(x, y)

  return group.includes(vicinity.up) || 
          group.includes(vicinity.down) ||
          group.includes(vicinity.left) || 
          group.includes(vicinity.right)
}

const mergeGroups = (indexes, groups) => {
  if (indexes.length < 2) {
    return groups
  }

  // gather up arrays which needs to be merged
  let mergedArray = groups.reduce((acc, cur, index) => {
    if (indexes.includes(index)) {
      acc = [...acc, cur]
    }

    return acc
  }, [])

  mergedArray = _.flatten(mergedArray) // e.g. ["0-0", "0-1", "0-2", "0-1"]
  mergedArray = _.uniq(mergedArray) // e.g. ["0-0", "0-1", "0-2"]

  // remove arrays from original set which were merged and flattened
  // we want only arrays that were not in indexes array
  groups = groups.filter((val, index) => {
    return !indexes.includes(index)
  })

  // push new merged and flattened array to player's groups
  groups.push(mergedArray)

  return groups
}

const generateBoard = size => Array(size).fill().map(() => Array(size).fill(0))

const INITIAL_STATE = {
  board: generateBoard(9),
  groups: {
    1: [],
    2: []
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
    let foundIndex = []

    const { x: stoneX, y: stoneY, player: currentPlayer } = action.payload
    const position = `${stoneX}-${stoneY}`

    groups = groups[currentPlayer]

    // loop player's possible groups and
    // check if current stone position matches any existing groups
    const nodeGroups = groups.filter((group, index) => {
      if (checkVicinity(stoneX, stoneY, group)) {
        foundIndex.push(index)

        groups[index].push(position)

        return true
      }

      return false
    })

    if (!nodeGroups.length) {
      groups.push([position])
    }

    groups = mergeGroups(foundIndex, groups)

    return {
      ...state,
      groups: {
        ...state.groups,
        [currentPlayer]: groups
      }
    }
  }

  return state
}