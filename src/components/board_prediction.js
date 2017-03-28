import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Row, Col, Button, Modal } from 'antd'

class BoardPrediction extends Component {
  constructor(props) {
    super(props)

    this.state = {
      prediction: [],
    }

    this.handlePrediction = this.handlePrediction.bind(this)
    this.drawPrediction = this.drawPrediction.bind(this)
    this.openModal = this.openModal.bind(this)
  }

  handlePrediction() {
    fetch('http://localhost:8081/api/predict', {
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

        this.setState({ prediction }, this.openModal)
      })
      .catch((e) => {
        console.log('error in prediction', e)
      })
  }

  openModal() {
    Modal.success({
      title: 'Successful prediction',
      content: (
          this.drawPrediction()
      ),
      width: "50%",
      onOk() {},
      okText: "Close",
    })
  }

  drawPrediction() {
    const style = {
      backgroundColor: "#CC9966",
    }

    const rowStyle = {
      backgroundColor: "#fff",
      width: "60px",
      fontWeight: "bold",
      textAlign: "right",
      border: "0",
      paddingRight: "5px",
    }

    const thRowStyle = { textAlign: "center", verticalAlign: "bottom", lineHeight: "60px" }
    const thColStyle = {
      width: "60px",
      height: "60px",
      backgroundColor: "#fff",
      verticalAlign: "bottom",
      lineHeight: "60px",
    }

    if (!this.props.board.board[0]) {
      return <div>Loading...</div>
    }

    return (
      <div className="prediction-board">
        <Row style={thRowStyle}>
          <Col span="1" style={thColStyle} />
          {this.props.board.board[0].map((x, i) => <Col key={`th${i}`} span="2" style={thColStyle}>{i}</Col>)}
        </Row>
        {this.props.board.board.map((row, y) => {
          return (
            <Row key={y}>
              <Col key={`prediction_td${y}`} span="2" style={thColStyle}>{y}</Col>

              {row.map((owner, x) => {

                if (!owner) owner = ""

                if (this.state.prediction[x] && this.state.prediction[x][y]) {
                  owner = Math.round(this.state.prediction[x][y])
                }

                const style = {
                  width: "60px",
                  height: "60px",
                  opacity: 1,
                  borderColor: "#000",
                  backgroundColor: "#CC9966",
                  textAlign: "center",
                  border: 1,
                }

                if (owner >= 2) {
                  style.backgroundColor = "#fff"
                }

                if (owner === 1) {
                  style.backgroundColor = "#000"
                }

                return (
                  <Col key={`prediction_${x}-${y}`} style={style} span="2">
                  </Col>
                )
              })}
            </Row>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <div>
        <Button onClick={this.handlePrediction}>
          Predict
        </Button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    board: state.board,
  }
}

export default connect(mapStateToProps)(BoardPrediction)