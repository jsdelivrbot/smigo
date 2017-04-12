import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { userListRequest } from '../actions/index'
import { getUserInfo, getUserList } from '../selectors/login_selector'

import ChatWindow from './chat/ChatWindow'

import { Row, Col, Input, Button, Form, Layout, Icon, Tabs } from 'antd'
const FormItem = Form.Item
const { Content, Sider } = Layout
const TabPane = Tabs.TabPane

// socket.io
import io from 'socket.io-client'
const url = `http://${window.location.hostname}:8081/chat`
const generalChatSocket = io(url)

generalChatSocket.on('error', console.error.bind(console))

generalChatSocket.on('connect', () => {
  // console.log('connected to server')
})

class Chat extends Component {
  constructor(props) {
    super(props)

    const panes = [
      { title: 'General chat', key: '1' },
      { title: 'Tab 2', key: '2' },
    ]

    this.state = {
      messages: { '1': [], '2': [] },
      incoming: { '1': {}, '2': {} },
      activeKey: panes[0].key,
      panes,
    }

    this.newTabIndex = 0

    this.props.userListRequest()

    this.getName = this.getName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderIncomingText = this.renderIncomingText.bind(this)
    this.renderInputs = this.renderInputs.bind(this)
    this.typingMessage = this.typingMessage.bind(this)
  }

  componentDidMount() {
    generalChatSocket.on('chat message', (msg, channel) => {
      const { messages } = this.state

      this.setState({
        messages: {
          ...messages,
          [channel]: [
            ...messages[channel],
            msg,
          ]
        }
      })
    })

    generalChatSocket.on('incoming chat message', (whoIsTyping, channel) => {
      const { incoming } = this.state

      const [name, isTyping] = whoIsTyping

      this.setState({
        incoming: {
          ...incoming,
          [channel]: {
            ...incoming[channel],
            [name]: isTyping,
          }
        }
      })
    })
  }

  componentWillUnmount() {
    generalChatSocket.removeListener('chat message')
    generalChatSocket.removeListener('incoming chat message')
  }

  handleSubmit(e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { message } = values

        const user = this.props.user
        const timestamp = moment().format('hh:mm')
        const channel = this.state.activeKey

        generalChatSocket.emit('chat message', { user, message, timestamp }, channel)

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
    const channel = this.state.activeKey

    generalChatSocket.emit('incoming chat message', [name, isTyping], channel)
  }

  renderSider(userList) {
    return (
      <Sider width={120} style={{ background: '#fff' }}>
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Icon type="user" /> Logged users
        </div>
        {userList.map((user, i) => <div key={`user-${i}`}>{user.name}</div>)}
      </Sider>
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
    const channel = this.state.activeKey

    const whoIsTyping = Object.keys(this.state.incoming[channel])
      .filter((val, i) => this.state.incoming[channel][val])

    if (whoIsTyping.length === 0) return false

    return (
      <Row>
        <Col span={24}>
          {whoIsTyping.map((name, i) => <div key={`typing-${i}`}>{name} is typing...</div>)}
        </Col>
      </Row>
    )
  }

  onChannelChange = (activeKey) => {
    this.setState({ activeKey })
  }

  render() {
    const userList = this.props.userList || []

    return (
      <Layout className="layout" style={{ width: '100%', backgroundColor: "#fff" }}>
        {this.renderSider(userList)}
        <Tabs
          onChange={this.onChannelChange}
          activeKey={this.state.activeKey}
          tabPosition="left"
          style={{ width: '100%' }}
        >
          {this.state.panes.map(pane => {
            return (
              <TabPane tab={pane.title} key={pane.key}>
                <Content style={{ padding: "10px" }}>
                  <ChatWindow messages={this.state.messages[pane.key]} />
                  {this.renderInputs()}
                  {this.renderIncomingText()}
                </Content>
              </TabPane>
            )
          })}
        </Tabs>
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
