import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Row, Col } from 'antd'

import BoardGame from './board_game'
import BoardPrediction from './board_prediction'

class Game extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col span="12" offset="6">
            <BoardGame />
          </Col>
        </Row>
        <Row justify="center">
          <Col span="12" offset="6">
            <BoardPrediction />
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ game }) {
  return { game }
}

export default connect(mapStateToProps)(Game)
