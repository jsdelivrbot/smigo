import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Layout, Menu, Button } from 'antd'

import { logout } from '../actions/index'

const { Header } = Layout

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: 1
    }

    this.renderLogin = this.renderLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout(e) {
    e.preventDefault()

    console.log('logout click')

    const id = this.props.login.user._id

    console.log('id', id)

    this.props.logout(id)
  }

  renderLogin() {
    if (this.props.login.user !== null) {
      return (
        <div>
          Logged in as {this.props.login.user.name},
          <Button
            type="danger"
            size="small"
            icon="logout"
            onClick={this.handleLogout}
            style={{ marginLeft: "10px" }}
          >
            Logout
          </Button>
        </div>
      )
    }

    return <NavLink to="/login"><Button size="small" icon="login">Login</Button></NavLink>
  }

  render() {
    return (
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
            <Menu.Item key="99" style={{ float: "right" }}>{this.renderLogin()}</Menu.Item>
          </Menu>
        </Header>
    )
  }
}

function mapStateToProps({ login }) {
  return { login }
}

function mapDispatchToProps(dispatch) {
  const actions = { logout }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
