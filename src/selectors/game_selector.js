import { createSelector } from 'reselect'

export const getGame = state => state.game

export const getWhosTurn = createSelector(
  [getGame],
  (game) => {
    console.log('getWhosTurn called')
    return game.whosTurn
  }
)
