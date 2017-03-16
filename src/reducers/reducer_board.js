import _ from 'lodash'

import { 
  UPDATE_BOARD,
  DETECT_AND_MERGE_GROUPS,
  COUNT_LIBERTIES,
  CAPTURE_GROUPS,
} from '../actions/types'

import {
  vicinity,
  checkVicinity,
  mergeGroups,
  updateBoard,
  iterateGroups,
  calculateLiberties,
  getLibertyCoordinates,
  playerGroupLiberties,
  reduceOpponentLibertyGroups,
} from '../utils/helpers'

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

    const [opponentLibertyGroups, capturedPrisoners, board] = reduceOpponentLibertyGroups(state, action)

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