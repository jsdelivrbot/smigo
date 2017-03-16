import _ from 'lodash'

import { 
  UPDATE_BOARD,
  DETECT_AND_MERGE_GROUPS,
  COUNT_LIBERTIES,
  CAPTURE_GROUPS,
} from '../actions/types'

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

const updateBoard = ({ x, y, player }, state) => {
  let board = [...state.board]
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

const calculateLiberties = (x, y, state, liberties) => {
  const surroundings = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ]

  const board = [...state.board]

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

const getLibertyCoordinates = (group, state) => {
  const libertyCoordinates = group.reduce((acc, cur) => {
    let [coordX, coordY] = cur.split("-");

    coordX = Number(coordX)
    coordY = Number(coordY)

    return calculateLiberties(coordX, coordY, state, acc)
  }, [])

  return _.uniq(libertyCoordinates)
}

const playerGroupLiberties = (player, state) => {
  return player.map(group => {
    const libertyCount = getLibertyCoordinates(group, state).length

    return [group, libertyCount]
  })
}

const generateBoard = size => Array(size).fill().map(() => Array(size).fill(0))

const INITIAL_STATE = {
  board: generateBoard(9),
  prisoners: {
    1: 0,
    2: 0,
  },
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
    return {
      ...state,
      board: updateBoard(action.payload, state)
    }
  case DETECT_AND_MERGE_GROUPS:
    let playerGroups = state.groups[action.payload.player]

    // loop player's possible groups and
    // check if current stone position matches any existing groups
    const [nodeGroups, foundIndexes] = iterateGroups(action.payload, playerGroups)

    if (!nodeGroups.length) {
      playerGroups.push([`${action.payload.x}-${action.payload.y}`])
    }

    playerGroups = mergeGroups(foundIndexes, playerGroups)

    return {
      ...state,
      groups: {
        ...state.groups,
        [action.payload.player]: playerGroups
      }
    }
  case COUNT_LIBERTIES:
    // both players groups
    // 1 = black
    // 2 = white

    // loop each player's groups and their liberties
    const libertyGroups = Object
      .values({ ...state.groups })
      .map(player => playerGroupLiberties(player, state))

    return { 
      ...state,
      liberties: {
        1: libertyGroups[0],
        2: libertyGroups[1],
      }
    }
  case CAPTURE_GROUPS:
    // remove any opponent player's groups from the board if their liberties reach to zero
    const opponent = action.payload.player % 2 === 0 ? 1 : 2

    // player's current prisoners
    let capturedPrisoners = state.prisoners[action.payload.player]

    let board = [...state.board]

    const opponentLibertyGroups = [...state.liberties[opponent]].filter(([group, liberties]) => {
      if (!liberties) {
        // add group to prisoners
        capturedPrisoners += group.length

        // remove captured group from board
        group.map(coordinate => {
          const [x, y] = coordinate.split("-")

          board[x][y] = 0
        })

        // remove captured group from liberties
        return false
      }

      return true
    })

    const opponentGroups = opponentLibertyGroups.reduce((prev, cur) => {
      prev = [...prev, cur[0]]

      return prev
    }, [])

    return {
      ...state,
      board,
      liberties: {
        ...state.liberties,
        [opponent]: opponentLibertyGroups,
      },
      groups: {
        ...state.groups,
        [opponent]: opponentGroups,
      },
      prisoners: {
        ...state.prisoners,
        [action.payload.player]: capturedPrisoners,
      }
    }
  }

  return state
}