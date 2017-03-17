import { createStore, applyMiddleware, compose } from 'redux'

import reducers from './reducers'

export default function configureStore(initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducers, /* preloadedState, */
    composeEnhancers(
      applyMiddleware()
      // applyMiddleware(...middleware)
    )
  )

  return store
}