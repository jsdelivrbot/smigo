import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getUserInfo, getUserList } from '../selectors/login_selector'

import { userListRequest } from '../actions/index'

import { Row, Col, Input, Button, Card, Form, Layout } from 'antd'
const FormItem = Form.Item
const { Content, Sider } = Layout

// socket.io
import io from 'socket.io-client'
const url = `http://${window.location.hostname}:8081`
const socket = io(url)

socket.on('error', console.error.bind(console))

socket.on('connect', () => {
  // console.log('connected to server')
})

class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
    }

    this.props.userListRequest()

    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderChatMessages = this.renderChatMessages.bind(this)
    this.renderChatWindow = this.renderChatWindow.bind(this)
    this.renderInputs = this.renderInputs.bind(this)
  }

  componentDidMount() {
    socket.on('chat message', (msg) => {
      const { messages } = this.state

      this.setState({
        messages: [
          ...messages,
          msg
        ]
      })
    })
  }

  componentWillUnmount() {
    socket.removeListener('chat message')
  }

  handleSubmit(e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { message } = values

        const user = this.props.user
        const date = new Date()
        const timestamp = `${date.getHours()}:${date.getMinutes()}`

        socket.emit('chat message', { user, message, timestamp })

        this.props.form.setFieldsValue({ message: "" })
      }
    })
  }

  renderSider(userList) {
    return (
      <Sider width={200} style={{ background: '#fff' }}>
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>Logged users</div>
        {userList.map((user, i) => <div key={`user-${i}`}>{user.name}</div>)}
      </Sider>
    )
  }

  renderChatWindow() {
    return (
      <Row>
        <Col span={24}>
          <Card style={{ height: "600px", marginBottom: "20px" }}>
            {this.renderChatMessages()}
          </Card>
        </Col>
      </Row>
    )
  }

  renderChatMessages() {
    return this.state.messages.map(this.renderChatMessage)
  }

  renderChatMessage(obj, i) {
    return (
      <Row key={`msg-${i}`}>
        <Col span={1}>
          {obj.timestamp}
        </Col>
        <Col span={2}>
          {obj.user === null ? "Anonymous" : obj.user.name}
        </Col>
        <Col span={21}>
          {obj.message}
        </Col>
      </Row>
    )
  }

  renderInputs() {
    const { getFieldDecorator } = this.props.form

    return (
      <Row>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Col span={22}>
            <FormItem style={{ marginRight: "10px", marginTop: "-2px" }}>
              {getFieldDecorator('message', {
                rules: [{ required: true, message: 'You need to write something' }],
              })(
                <Input placeholder="Write some text..." />
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Send
            </Button>
          </Col>
        </Form>
      </Row>
    )
  }

  render() {
    const userList = this.props.userList || []

    return (
      <Layout className="layout" style={{ width: '100%' }}>
        {this.renderSider(userList)}
        <Content style={{ padding: "10px" }}>
          {this.renderChatWindow()}
          {this.renderInputs()}
        </Content>
      </Layout>
    )
  }
}

const ChatForm = Form.create()(Chat)

function mapStateToProps(state) {
  return {
    user: getUserInfo(state),
    userList: getUserList(state)
  }
}

function mapDispatchToProps(dispatch) {
  const actions = {
    userListRequest,
  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatForm)
