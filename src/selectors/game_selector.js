import { createSelector } from 'reselect'

export const getGame = state => state.game

export const getWhosTurn = createSelector(
  [getGame],
  game => game.whosTurn
)

export const getPlayers = createSelector(
  [getGame],
  game => game.players
)
