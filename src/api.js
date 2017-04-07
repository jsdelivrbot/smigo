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
      const { success, error, user } = response

      if (error) {
        throw new Error(error)

        return false
      }

      if (!success) {
        throw new Error('Cannot find user')

        return false
      }

      return user
    })
}
