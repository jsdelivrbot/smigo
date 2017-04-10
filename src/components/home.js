import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getUserInfo } from '../selectors/login_selector'

import { Row, Col, Input, Button, Card, Form } from 'antd'
const FormItem = Form.Item

// socket.io
import io from 'socket.io-client'
const url = `http://${window.location.hostname}:8081`
const socket = io(url)

socket.on('error', console.error.bind(console))

socket.on('connect', () => {
  // console.log('connected to server')
})

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this)
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

        socket.emit('chat message', { user, message })

        this.props.form.setFieldsValue({ message: "" })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <Row>
          <Col span={24}>
            <Card style={{ height: "600px", marginBottom: "20px" }}>
              {this.state.messages.map((obj, i) => {
                return (
                  <Row key={`msg-${i}`}>
                    <Col span={4}>
                      {obj.user === null ? "Anonymous" : obj.user.name}:
                    </Col>
                    <Col span={20}>
                      {obj.message}
                    </Col>
                    <hr />
                  </Row>
                )
              })}
            </Card>
          </Col>
        </Row>
        <Row>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Col span={23}>
              <FormItem>
                {getFieldDecorator('message', {
                  rules: [{ required: true, message: 'You need to write something' }],
                })(
                  <Input placeholder="Write some text..." />
                )}
              </FormItem>
            </Col>
            <Col span={1}>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Send
              </Button>
            </Col>
          </Form>
        </Row>
      </div>
    )
  }
}

const HomeForm = Form.create()(Home)

function mapStateToProps(state) {
  return {
    user: getUserInfo(state),
  }
}

export default connect(mapStateToProps)(HomeForm)
