import { createSelector } from 'reselect'

export const getBoard = state => state.board

export const getBoardLayout = createSelector(
  [getBoard],
  (board) => {
    console.log('getBoardLayout called', board)
    return board.board
  }
)
