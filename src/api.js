import feathers from 'feathers/client'
import rest from 'feathers-rest/client'

const app = feathers()
  .configure(rest(`http://${window.location.hostname}:8081`)
  .fetch(window.fetch.bind(window)))

export const getUser = (username, password) => app.service('/api/users').find({ username, password })
export const generateToken = id => app.service('/api/token').get(id)
export const storeItem = (storageId, token) => localStorage.setItem(storageId, token)
export const clearItem = storageId => localStorage.removeItem(storageId)
export const saveToken = (id, token) => app.service(`/api/users`).patch(id, { token })
export const getUsers = () => app.service('/api/users').find()
