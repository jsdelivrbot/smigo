import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import App from './components/app'
import configureStore from './store'

const [store, history] = configureStore()

ReactDOM.render(
  (
    <Provider store={store}>
      <ConnectedRouter history={history}>
          <App />
      </ConnectedRouter>
    </Provider>
  )
  , document.querySelector('.container'))
