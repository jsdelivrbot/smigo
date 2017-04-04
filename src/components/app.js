import React, { Component } from 'react'
import { Route, NavLink, Switch } from 'react-router-dom'
import { Layout, Menu } from 'antd'

const { Header, Content, Footer } = Layout

import Home from './home'
import Game from './game'
import Editor from './editor/editor'
import LoginForm from './login'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: 1
    }
  }

  render() {
    return (
      <Layout className="layout" style={{ width: '100%' }}>
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[`${this.state.selected}`]}
            style={{ lineHeight: '64px' }}
            onClick={e => { this.setState({ selected: e.key })}}
          >
            <Menu.Item key="1"><NavLink to="/">Home</NavLink></Menu.Item>
            <Menu.Item key="2"><NavLink to="/game">Game</NavLink></Menu.Item>
            <Menu.Item key="3"><NavLink to="/editor">Editor</NavLink></Menu.Item>
            <Menu.Item key="99" style={{ float: "right" }}><NavLink to="/login">Login</NavLink></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Switch>
              <Route exact path="/" component={Home} />
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
