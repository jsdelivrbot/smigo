import React, { Component } from 'react'
import { Row, Col } from 'antd'

class IncomingText extends Component {
  render() {
    const whoIsTyping = Object.keys(this.props.incoming)
      .filter((val, i) => this.props.incoming[val])

    if (whoIsTyping.length === 0) return false

    return (
      <Row>
        <Col span={24}>
          {whoIsTyping.map((name, i) => <div key={`typing-${i}`}>{name} is typing...</div>)}
        </Col>
      </Row>
    )
  }
}

export default IncomingText
