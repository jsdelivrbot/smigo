import React, { Children, Component } from 'react'
import { Row, Col, Card, Alert } from 'antd'

class ChatWindow extends Component {
  constructor(props) {
    super(props)

    this.renderChatMessages = this.renderChatMessages.bind(this)
  }

  renderChatMessages() {
    return this.props.messages.map(this.renderMessage)
  }

  renderMessage(obj, i) {
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

  render() {
    const style = {
      height: "600px",
      marginBottom: "20px",
      overflowY: "scroll"
    }

    return (
      <Row>
        <Col span={24}>
          <Card style={style}>
            {this.renderChatMessages()}
          </Card>
        </Col>
      </Row>
    )
  }
}

export default ChatWindow
