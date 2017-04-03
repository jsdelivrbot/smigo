import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'

const { Header, Content, Footer } = Layout

import Home from './home'
import Game from './game'
import Editor from './editor/editor'

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
            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
            <Menu.Item key="2"><Link to="game">Game</Link></Menu.Item>
            <Menu.Item key="3"><Link to="editor">Editor</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Route exact path="/" component={Home} />
            <Route path="/game" component={Game} />
            <Route path="/editor" component={Editor} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          some footer text
        </Footer>
      </Layout>
    )
  }
}

export default App
