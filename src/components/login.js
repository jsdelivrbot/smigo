import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'

import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd'
const FormItem = Form.Item

import { login_request } from '../actions/index'
import { getUserInfo } from '../selectors/login_selector'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = { redirect: false }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { username, password } = values

        this.props.login_request(username, password)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== null && nextProps.user._id) {
      this.setState({ redirect: true }, message.success(`Welcome, ${nextProps.user.name}`))
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />
    }

    const { getFieldDecorator } = this.props.form
    return (
      <Row>
        <Col span={8} offset={8}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>
              )}
              <a className="login-form-forgot">Forgot password</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or <a>register now!</a>
            </FormItem>
          </Form>
        </Col>
        <Col span={8}>
        </Col>
      </Row>
    );
  }
}

const LoginForm = Form.create()(Login)

function mapStateToProps(state) {
  return {
    user: getUserInfo(state)
  }
}

function mapDispatchToProps(dispatch) {
  const actions = { login_request }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
