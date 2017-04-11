import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'

const { Content, Footer } = Layout

import NavBar from './nav_bar'
import Chat from './chat'
import Game from './game'
import Editor from './editor/editor'
import LoginForm from './login'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout className="layout" style={{ width: '100%' }}>
        <NavBar />
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Switch>
              <Route exact path="/" component={Chat} />
              <Route path="/game" component={Game} />
              <Route path="/editor" component={Editor} />
              <Route path="/login" component={LoginForm} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          some footer text
        </Footer>
      </Layout>
    )
  }
}

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)

export default App
