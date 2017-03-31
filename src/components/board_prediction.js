import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Modal } from 'antd'
import Board from './board/board'

class BoardPrediction extends Component {
  constructor(props) {
    super(props)

    this.state = {
      prediction: this.props.board.board,
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
      body: JSON.stringify({ board: this.props.board.board })
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
      <div>
        <Button onClick={this.handlePrediction}>
          Predict
        </Button>
        <Board
          type={"prediction"}
          onClick={() => {}}
          onCheckTurn={() => {}}
          board={this.state.prediction}
        />
      </div>
    )
  }
}

function mapStateToProps({ board }) {
  return { board }
}

export default connect(mapStateToProps)(BoardPrediction)
