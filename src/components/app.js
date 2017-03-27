import React, { Component } from 'react'

import { Layout, Menu } from 'antd'
const { Header, Content, Footer } = Layout

import Game from './Game'

class App extends Component {
  render() {
    return (
      <Layout className="layout" style={{ width: '100%' }}>
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Game />
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