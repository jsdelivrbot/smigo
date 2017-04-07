import { createSelector } from 'reselect'

export const getUser = state => state.login.user

export const getUserInfo = createSelector(
  [getUser],
  user => user
)

export const getError = state => state.login.error

export const getLoginError = createSelector(
  [getError],
  error => error
)
