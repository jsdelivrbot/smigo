import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { userListRequest } from '../actions/index'
import { getUserInfo, getUserList } from '../selectors/login_selector'

import ChatWindow from './chat/ChatWindow'
import IncomingText from './chat/IncomingText'
import MessageInputs from './chat/MessageInputs'

import { Form, Layout, Icon, Tabs } from 'antd'
const { Content, Sider } = Layout
const TabPane = Tabs.TabPane

// socket.io
import io from 'socket.io-client'
const url = `http://${window.location.hostname}:8081/chat`
const chatSocket = io(url)

chatSocket.on('error', console.error.bind(console))

chatSocket.on('connect', () => {
  // console.log('connected to server')
})

class Chat extends Component {
  constructor(props) {
    super(props)

    const panes = [
      { title: 'General chat', key: 0 },
      { title: 'Room 1', key: 1 },
    ]

    this.state = {
      messages: { 0: [], 1: [] },
      incoming: { 0: {}, 1: {} },
      channel: panes[0].key,
      panes,
    }

    this.newTabIndex = 0

    this.props.userListRequest()

    this.getName = this.getName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.typingMessage = this.typingMessage.bind(this)
  }

  appendMessages({ msg, channel, messages }) {
    return {
      ...messages,
      [channel]: [
        ...messages[channel],
        msg,
      ]
    }
  }

  appendIncoming({ name, isTyping, channel, incoming }) {
    return {
      ...incoming,
      [channel]: {
        ...incoming[channel],
        [name]: isTyping,
      }
    }
  }

  componentDidMount() {
    chatSocket.on('chat message', (msg, channel) => {
      const { messages } = this.state

      this.setState({
        messages: this.appendMessages({ msg, channel, messages })
      })
    })

    chatSocket.on('incoming chat message', (whoIsTyping, channel) => {
      const { incoming } = this.state

      const [name, isTyping] = whoIsTyping

      this.setState({
        incoming: this.appendIncoming({ name, isTyping, channel, incoming })
      })
    })
  }

  componentWillUnmount() {
    chatSocket.removeListener('chat message')
    chatSocket.removeListener('incoming chat message')
  }

  handleSubmit(e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { message } = values

        const user = this.props.user
        const timestamp = moment().format('hh:mm')
        const { channel } = this.state

        chatSocket.emit('chat message', { user, message, timestamp }, channel)

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
    const { channel } = this.state

    chatSocket.emit('incoming chat message', [name, isTyping], channel)
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

  handleChannelChange = channel => this.setState({ channel })

  render() {
    const userList = this.props.userList || []
    const { channel } = this.state

    return (
      <Layout className="layout" style={{ width: '100%', backgroundColor: "#fff" }}>
        {this.renderSider(userList)}
        <Tabs
          onChange={this.handleChannelChange}
          activeKey={String(this.state.channel)}
          tabPosition="left"
          style={{ width: '100%' }}
        >
          {this.state.panes.map(pane => {
            return (
              <TabPane tab={pane.title} key={pane.key}>
                <Content style={{ padding: "10px" }}>
                  <ChatWindow messages={this.state.messages[pane.key]} />
                  <MessageInputs
                    form={this.props.form}
                    onSubmit={this.handleSubmit}
                    onChange={this.typingMessage}
                  />
                  <IncomingText incoming={this.state.incoming[channel]} />
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
