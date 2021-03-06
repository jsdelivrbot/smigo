import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'

// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

export const getBoard = state => state.board

export const getBoardLayout = createDeepEqualSelector(
  [getBoard],
  board => board.board
)

export const getGroups = createDeepEqualSelector(
  [getBoard],
  board => board.groups
)
