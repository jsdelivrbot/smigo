import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Row, Col } from 'antd'

import Board from './board'
import BoardPrediction from './board_prediction'

class Game extends Component {
  render() {
    return (
      <div>
        <Row justify="center">
          <Col span="12" offset="6">
            <BoardPrediction />
          </Col>
        </Row>
        <Row>
          <Col span="12" offset="6">
            <Board />
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { game: state.game }
}

export default connect(mapStateToProps)(Game)