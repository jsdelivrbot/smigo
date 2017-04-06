import { createSelector } from 'reselect'

export const getUser = state => state.login.user

export const getUserInfo = createSelector(
  [getUser],
  (user) => {
    console.log('getUserInfo called')
    // if (user === null) return {}

    return user
  }
)
