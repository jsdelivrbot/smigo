import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducers from './reducers'
import rootSaga from './sagas/index'

export default function configureStore(initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducers, /* preloadedState, */
    composeEnhancers(
      applyMiddleware(sagaMiddleware)
    )
  )

  sagaMiddleware.run(rootSaga)

  return store
}