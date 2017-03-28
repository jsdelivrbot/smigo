import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { placeStoneOnBoard } from '../actions/index'
import BoardNode from './board_node'

class Board extends Component {
  constructor(props) {
    super(props)

    this.handleOnClick = this.handleOnClick.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.handleCheckTurn = this.handleCheckTurn.bind(this)
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
    }

    if (!this.props.board) {
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
          {this.props.board.board.map(this.renderRow)}
        </tbody>
      </table>
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