import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'

class Controls extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.disabled.backwards !== nextProps.disabled.backwards ||
      this.props.disabled.forwards !== nextProps.disabled.forwards ||
      this.props.autoplayIcon !== nextProps.autoplayIcon
    )
  }

  render() {
    const style = { margin: "10px" }

    const props = {
      style: { margin: "10px" },
      shape: "circle",
      size: "large",
    }

    return (
      <Row style={{ marginTop: "20px" }}>
        <Col span={12} offset={6}>
          <Button
            {...props}
            icon="fast-backward"
            disabled={this.props.disabled.backwards}
            onClick={this.props.onClickFastBackward}
          />
          <Button
            {...props}
            icon="step-backward"
            disabled={this.props.disabled.backwards}
            onClick={this.props.onClickBackward}
          />
          <Button
            {...props}
            icon={this.props.autoplayIcon}
            onClick={this.props.onClickAutoPlay}
          />
          <Button
            {...props}
            icon="step-forward"
            disabled={this.props.disabled.forwards}
            onClick={this.props.onClickForward}
          />
          <Button
            {...props}
            icon="fast-forward"
            disabled={this.props.disabled.forwards}
            onClick={this.props.onClickFastForward}
          />
        </Col>
      </Row>
    )
  }
}

export default Controls
