import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { placeStoneOnBoard } from '../actions/index'
import BoardNode from './board_node'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      prediction: []
    }

    this.handleOnClick = this.handleOnClick.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.handleCheckTurn = this.handleCheckTurn.bind(this)
    this.handlePrediction = this.handlePrediction.bind(this)
    this.drawPrediction = this.drawPrediction.bind(this)
  }

  drawPrediction() {
    const style = {
      backgroundColor: "#CC9966"
    }

    const rowStyle = {
      backgroundColor: "#fff",
      width: "60px",
      fontWeight: "bold",
      textAlign: "right",
      border: "0",
      paddingRight: "5px",
    }

    if (!this.props.board.board[0]) {
      return <div>Loading...</div>
    }

    return (
      <table className="table-bordered" style={style}>
        <thead>
          <tr>
            <th></th>
            {this.props.board.board[0].map((x, i) => <th key={`th${i}`}>{i}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.props.board.board.map((row, y) => {
            return (
              <tr key={y}>
                <td key={`prediction_td${y}`} style={rowStyle}>{y}</td>

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
                  }

                  if (owner >= 2) {
                    style.backgroundColor = "#fff"
                  }

                  if (owner === 1) {
                    style.backgroundColor = "#000"
                  }

                  return (
                    <td key={`prediction_${x}-${y}`} style={style}>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
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

        this.setState({ prediction }, this.drawPrediction)
      })
      .catch((e) => {
        console.log('error in prediction', e)
      })
  }

  handleOnClick(x, y) {
    const { whosTurn } = this.props.game

    this.props.placeStoneOnBoard(x, y, whosTurn)

    return whosTurn
  }

  handleCheckTurn() {
    return this.props.game.whosTurn
  }

  renderRow(row, x) {
    const style = {
      backgroundColor: "#fff",
      width: "60px",
      fontWeight: "bold",
      textAlign: "right",
      border: "0",
      paddingRight: "5px",
    }

    return (
      <tr key={x}>
        <td key={`td${x}`} style={style}>{x}</td>
        {row.map((node, y) => {
          return (
            <BoardNode
              key={`${x}-${y}`}
              x={x}
              y={y}
              owner={this.props.board.board[x][y]}
              onChangeTurn={this.handleOnClick}
              onCheckTurn={this.handleCheckTurn}
            />
          )
        })}
      </tr>
    )
  }

  render() {
    const style = {
      backgroundColor: "#CC9966",
      float: "left",
    }

    if (!this.props.board) {
      return <div>Loading...</div>
    }

    return (
      <div className="table-container" style={{ width: "100%" }}>
        <table className="table-bordered" style={style}>
          <thead>
            <tr>
              <th></th>
              {this.props.board.board[0].map((x, i) => <th key={`th${i}`}>{i}</th>)}
            </tr>
          </thead>
          <tbody>
            {this.props.board.board.map(this.renderRow)}
          </tbody>
        </table>
        {this.drawPrediction()}
        <br />
        <button onClick={this.handlePrediction}>
          Predict
        </button>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    game: state.game,
    board: state.board,
  }
}

function mapDispatchToProps(dispatch) {
  const actions = { placeStoneOnBoard }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)