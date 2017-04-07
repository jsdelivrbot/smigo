import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Modal, Row, Col } from 'antd'

import Board from './board/board'
import { getBoardLayout } from '../selectors/board_selector'

class BoardPrediction extends Component {
  constructor(props) {
    super(props)

    this.state = {
      prediction: this.props.board,
    }

    this.handlePrediction = this.handlePrediction.bind(this)
  }

  handlePrediction() {
    const url = `http://${window.location.hostname}:8081/api/predict`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ board: this.props.board })
    })
      .then(response => response.json())
      .then(response => {
        const { prediction } = response

        this.setState({ prediction })
      })
      .catch((e) => {
        console.log('error in prediction', e)
      })
  }

  render() {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Row>
          <Col span={24}>
            <Button onClick={this.handlePrediction} style={{ marginLeft: "-25px" }}>
              Predict
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24} offset={1}>
            <Board
              type={"prediction"}
              onClick={() => {}}
              onCheckTurn={() => {}}
              board={this.state.prediction}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    board: getBoardLayout(state)
  }
}

export default connect(mapStateToProps)(BoardPrediction)
