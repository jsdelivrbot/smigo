import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { getUserInfo, getUserList } from '../selectors/login_selector'

import { userListRequest } from '../actions/index'

import { Row, Col, Input, Button, Card, Form, Layout, Icon, Alert } from 'antd'
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
      incoming: {},
    }

    this.props.userListRequest()

    this.getName = this.getName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderChatMessages = this.renderChatMessages.bind(this)
    this.renderChatWindow = this.renderChatWindow.bind(this)
    this.renderIncomingText = this.renderIncomingText.bind(this)
    this.renderInputs = this.renderInputs.bind(this)
    this.typingMessage = this.typingMessage.bind(this)
  }

  componentDidMount() {
    socket.on('chat message', msg => {
      const { messages } = this.state

      this.setState({
        messages: [
          ...messages,
          msg
        ]
      })
    })

    socket.on('incoming chat message', whoIsTyping => {
      const { incoming } = this.state

      const [name, isTyping] = whoIsTyping

      this.setState({
        incoming: {
          ...incoming,
          [name]: isTyping,
        }
      })
    })
  }

  componentWillUnmount() {
    socket.removeListener('chat message')
    socket.removeListener('incoming chat message')
  }

  handleSubmit(e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { message } = values

        const user = this.props.user
        const timestamp = moment().format('hh:mm')

        socket.emit('chat message', { user, message, timestamp })

        this.props.form.setFieldsValue({ message: "" })
        this.typingMessage(e)
      }
    })
  }

  getName() {
    return this.props.user && this.props.user.name || "Anonymous"
  }

  typingMessage(e) {
    e.preventDefault()

    const name = this.getName()

    const isTyping = e.target.value ? true : false

    socket.emit('incoming chat message', [name, isTyping])
  }

  renderSider(userList) {
    return (
      <Sider width={200} style={{ background: '#fff' }}>
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Icon type="user" /> Logged users
        </div>
        {userList.map((user, i) => <div key={`user-${i}`}>{user.name}</div>)}
      </Sider>
    )
  }

  renderChatWindow() {
    return (
      <Row>
        <Col span={24}>
          <Card
            title="Chat"
            style={{ height: "600px", marginBottom: "20px", overflowY: "scroll" }}>
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
    if (obj.user && obj.user.name === 'Notification') {
      return (
        <Row key={`msg-${i}`} style={{ marginBottom: "5px" }}>
          <Col span={24}>
            <Alert message={obj.message} type="info" showIcon />
          </Col>
        </Row>
      )
    }

    return (
      <Row key={`msg-${i}`} style={{ marginBottom: "5px" }}>
        <Col span={1} style={{ minWidth: "55px" }}>
          {obj.timestamp}
        </Col>
        <Col span={2} style={{ minWidth: "80px" }}>
          {obj.user === null ? "Anonymous" : obj.user.name}
        </Col>
        <Col span={21} style={{ width: "100%" }}>
          {obj.message}
          <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
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
                <Input placeholder="Write some text..." onChange={this.typingMessage} />
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

  renderIncomingText() {
    const whoIsTyping = Object.keys(this.state.incoming)
      .filter((val, i) => this.state.incoming[val])

    if (whoIsTyping.length === 0) return false

    return (
      <Row>
        <Col span={24}>
          {whoIsTyping.map((name, i) => <div key={`typing-${i}`}>{name} is typing...</div>)}
        </Col>
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
          {this.renderIncomingText()}
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
