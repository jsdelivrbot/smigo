import { createSelector } from 'reselect'

export const getUser = state => state.login.user
export const getUsers = state => state.login.users

export const getUserInfo = createSelector(
  [getUser],
  user => user
)

export const getUserList = createSelector(
  [getUsers],
  users => users
)

export const getError = state => state.login.error

export const getLoginError = createSelector(
  [getError],
  error => error
)
