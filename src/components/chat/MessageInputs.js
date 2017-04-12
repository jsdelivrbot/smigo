import React, { Component } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'
const FormItem = Form.Item

class MessageInputs extends Component {
  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Row>
        <Form onSubmit={this.props.onSubmit} className="login-form">
          <Col span={22}>
            <FormItem style={{ marginRight: "10px", marginTop: "-2px" }}>
              {getFieldDecorator('message', {
                rules: [{ required: true, message: 'You need to write something' }],
              })(
                <Input placeholder="Write some text..." onChange={this.props.onChange} />
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
}

export default MessageInputs
