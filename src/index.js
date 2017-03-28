import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './components/app'
import configureStore from './store'

ReactDOM.render(
  (
    <Router>
      <Provider store={configureStore()}>
        <App />
      </Provider>
    </Router>
  )
  , document.querySelector('.container'))