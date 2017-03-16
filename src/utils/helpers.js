export const vicinity = (x, y) => {
  return {
    up: `${x}-${y - 1}`,
    down: `${x}-${y + 1}`,
    left: `${x - 1}-${y}`,
    right: `${x + 1}-${y}`,
  }
}

export const checkVicinity = (x, y, group) => {
  // coordinates around stone position
  const surroundings = vicinity(x, y)

  return group.includes(surroundings.up) || 
          group.includes(surroundings.down) ||
          group.includes(surroundings.left) || 
          group.includes(surroundings.right)
}

export const mergeGroups = (indexes, groups) => {
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

export const updateBoard = ({ x, y, player }, state) => {
  let board = [...state.board]
  board[x][y] = player

  return board
}

export const iterateGroups = ({ x, y, player }, groups) => {
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

export const calculateLiberties = (x, y, state, liberties) => {
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

export const belongsToGroup = (x, y, state, player) => {
  const surroundings = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ]

  const board = [...state.board]

  let belongsTo = false

  surroundings.map(coordinate => {
    const [coordX, coordY] = coordinate

    if (board[coordX] === undefined) {
      return
    }

    if (board[coordX][coordY] === player) {
      belongsTo = true
    }
  })

  return belongsTo
}

export const getLibertyCoordinates = (group, state) => {
  const libertyCoordinates = group.reduce((acc, cur) => {
    let [coordX, coordY] = cur.split("-");

    coordX = Number(coordX)
    coordY = Number(coordY)

    return calculateLiberties(coordX, coordY, state, acc)
  }, [])

  return _.uniq(libertyCoordinates)
}

export const playerGroupLiberties = (player, state) => {
  return player.map(group => {
    const libertyCount = getLibertyCoordinates(group, state).length

    return [group, libertyCount]
  })
}

export const reduceOpponentLibertyGroups = (state, action) => {
  const opponent = action.payload.player % 2 === 0 ? 1 : 2

  // player's current prisoners
  let capturedPrisoners = state.prisoners[action.payload.player]

  let board = [...state.board]

  const libertyGroups = [...state.liberties[opponent]].filter(([group, liberties]) => {
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

  return [libertyGroups, capturedPrisoners, board]
}