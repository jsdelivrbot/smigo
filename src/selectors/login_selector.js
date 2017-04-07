import { createSelector } from 'reselect'

export const getUser = state => state.login.user

export const getUserInfo = createSelector(
  [getUser],
  user => user
)
