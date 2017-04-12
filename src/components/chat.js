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
      { title: 'General chat', key: 0, closable: false },
      { title: 'Room 1', key: 1, closable: true },
      { title: 'Room 2', key: 2, closable: true },
      { title: 'Room 3', key: 3, closable: true },
      { title: 'Room 4', key: 4, closable: true },
      { title: 'Room 5', key: 5, closable: true },
      { title: 'Room 6', key: 6, closable: true },
      { title: 'Room 7', key: 7, closable: true },
      { title: 'Room 8', key: 8, closable: true },
      { title: 'Room 9', key: 9, closable: true },
      { title: 'Room 10', key: 10, closable: true },
      { title: 'Room 11', key: 11, closable: true },
      { title: 'Room 12', key: 12, closable: true },
      { title: 'Room 13', key: 13, closable: true },
      { title: 'Room 14', key: 14, closable: true },
    ]

    const messages = panes.reduce((prev, cur, i) => {
      prev[i] = []

      return prev
    }, {})

    const incoming = panes.reduce((prev, cur, i) => {
      prev[i] = {}

      return prev
    }, {})

    this.state = {
      messages,
      incoming,
      channel: panes[0].key,
      panes,
    }

    this.newTabIndex = 0

    this.props.userListRequest()

    this.getName = this.getName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.typingMessage = this.typingMessage.bind(this)
  }

  appendMessages = ({ msg, channel, messages }) => {
    return {
      ...messages,
      [channel]: [
        ...messages[channel],
        msg,
      ]
    }
  }

  appendIncoming = ({ name, isTyping, channel, incoming }) => {
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

  handleSubmit = e => {
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

  typingMessage = e => {
    e.preventDefault()

    const name = this.getName()
    const isTyping = e.target.value ? true : false
    const { channel } = this.state

    chatSocket.emit('incoming chat message', [name, isTyping], channel)
  }

  renderSider = userList => {
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

  onEdit = (targetKey, action) => {
    console.log('action', action)

    if (action === 'remove') this[action](targetKey)
  }

  remove = (targetKey) => {
    let { channel, panes } = this.state

    let lastIndex

    targetKey = Number(targetKey)

    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    })

    const newPanes = panes.filter(pane => pane.key !== targetKey)

    if (lastIndex >= 0 && channel === targetKey) {
      channel = newPanes[lastIndex].key
    }

    this.setState({ panes: newPanes, channel })
  }

  render() {
    const userList = this.props.userList || []
    const { channel, messages, incoming } = this.state

    return (
      <Layout className="layout" style={{ width: '100%', backgroundColor: "#fff" }}>
        {this.renderSider(userList)}
        <Tabs
          onChange={this.handleChannelChange}
          activeKey={String(channel)}
          tabPosition="top"
          type="editable-card"
          animated={false}
          style={{ width: '100%', marginLeft: "20px" }}
          onEdit={this.onEdit}
        >
          {this.state.panes.map(pane => {
            return (
              <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                <Content style={{ padding: "10px" }}>
                  <ChatWindow messages={messages[pane.key]} />
                  <MessageInputs
                    form={this.props.form}
                    onSubmit={this.handleSubmit}
                    onChange={this.typingMessage}
                  />
                  <IncomingText incoming={incoming[channel]} />
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

const mapStateToProps = state => { return { user: getUserInfo(state), userList: getUserList(state) }}
const mapDispatchToProps = dispatch => bindActionCreators({ userListRequest }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChatForm)
