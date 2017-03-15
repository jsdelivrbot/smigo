import _ from 'lodash'

import { 
  UPDATE_BOARD,
  DETECT_AND_MERGE_GROUPS,
  COUNT_LIBERTIES,
} from '../actions/index'

const vicinity = (x, y) => {
  return {
    up: `${x}-${y - 1}`,
    down: `${x}-${y + 1}`,
    left: `${x - 1}-${y}`,
    right: `${x + 1}-${y}`,
  }
}

const checkVicinity = (x, y, group) => {
  // coordinates around stone position
  const surroundings = vicinity(x, y)

  return group.includes(surroundings.up) || 
          group.includes(surroundings.down) ||
          group.includes(surroundings.left) || 
          group.includes(surroundings.right)
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

const updateBoard = ({ x, y, player }, board) => {
  board[x][y] = player

  return board
}

const iterateGroups = ({ x, y, player }, groups) => {
  let indexes = []

  groups = groups.filter((group, index) => {
    if (checkVicinity(x, y, group)) {
      indexes.push(index)

      groups[index].push(`${x}-${y}`)

      return true
    }

    return false
  })

  return [groups, indexes]
}

const calculateLiberties = (x, y, board, liberties) => {
  const surroundings = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ]

  surroundings.map(coordinate => {
    const [coordX, coordY] = coordinate

    if (board[coordX] === undefined) {
      return
    }

    if (board[coordX][coordY] === 0) {
      liberties = [...liberties, coordinate.join('-')]
    }
  })

  return liberties
}

const getLibertyCoordinates = (group, board) => {
  const libertyCoordinates = group.reduce((acc, cur) => {
    let [coordX, coordY] = cur.split("-");

    coordX = Number(coordX)
    coordY = Number(coordY)

    return calculateLiberties(coordX, coordY, board, acc)
  }, [])

  return _.uniq(libertyCoordinates)
}

const generateBoard = size => Array(size).fill().map(() => Array(size).fill(0))

const INITIAL_STATE = {
  board: generateBoard(9),
  liberties: {
    1: [],
    2: [],
  },
  groups: {
    1: [],
    2: []
  },
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case UPDATE_BOARD:
    const newBoard = updateBoard(action.payload, [...state.board])

    return { ...state, newBoard }
  case DETECT_AND_MERGE_GROUPS:
    let groups = { ...state.groups }

    groups = groups[action.payload.player]

    // loop player's possible groups and
    // check if current stone position matches any existing groups
    const [nodeGroups, foundIndexes] = iterateGroups(action.payload, groups)

    if (!nodeGroups.length) {
      groups.push([`${action.payload.x}-${action.payload.y}`])
    }

    groups = mergeGroups(foundIndexes, groups)

    return {
      ...state,
      groups: {
        ...state.groups,
        [action.payload.player]: groups
      }
    }
  case COUNT_LIBERTIES:
    const groupsToCount = { ...state.groups }

    const libertyGroups = groupsToCount[action.payload.player]
      .map(group => {
        const libertyCount = getLibertyCoordinates(group, [...state.board]).length

        return [group, libertyCount]
      })

    return { 
      ...state,
      liberties: {
        ...state.liberties,
        [action.payload.player]: libertyGroups,
      }
    }
  }

  return state
}