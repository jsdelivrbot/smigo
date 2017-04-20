import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, Link } from 'react-router-dom'

import { Form, Icon, Input, Button, Checkbox, Row, Col, message, Alert } from 'antd'
const FormItem = Form.Item

import { login_request, clear_errors } from '../actions/index'
import { getUserInfo, getLoginError } from '../selectors/login_selector'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      redirect: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.onCloseClick = this.onCloseClick.bind(this)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email, password } = values

        this.props.login_request(email, password)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== null && nextProps.user.token) {
      this.setState({ redirect: true }, message.success(`Welcome, ${nextProps.user.name}`))
    }
  }

  onCloseClick() {
    this.props.clear_errors()
  }

  renderError(error) {
    if (error === null) return <div></div>

    return (
      <Col span={8} offset={8} style={{ minWidth: "300px" }}>
        <Alert message="Error in login"
          description={error.message}
          type="error"
          closable
          onClose={this.onCloseClick}
        />
      </Col>
    )
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />
    }

    const { getFieldDecorator } = this.props.form

    return (
      <Row>
        {this.props.error && this.renderError(this.props.error)}
        <Col span={8} offset={8}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="E-mail" />
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
              Or <Link to="/register">register now!</Link>
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
    user: getUserInfo(state),
    error: getLoginError(state),
  }
}

function mapDispatchToProps(dispatch) {
  const actions = {
    login_request,
    clear_errors
  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
