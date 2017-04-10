export const authorize = (username, password) => {
  const url = `http://${window.location.hostname}:8081/api/login`

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(response => {
      const { success, error, user, id } = response

      if (error) {
        throw new Error(error)

        return false
      }

      if (!success) {
        throw new Error('User not found.')

        return false
      }

      return [user, id]
    })
}

export const storeItem = (storageId, token) => {
  localStorage.setItem(storageId, token)
}

export const clearItem = storageId => localStorage.removeItem(storageId)

export const saveToken = (id, token) => {
  const url = `http://${window.location.hostname}:8081/api/save_token`

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ id, token })
  })
    .then(response => response.json())
    .then(response => {
      const { success, error } = response

      if (error) {
        throw new Error(error)

        return false
      }

      if (!success) {
        throw new Error('Token could not be saved.')

        return false
      }

      return success
    })
}
