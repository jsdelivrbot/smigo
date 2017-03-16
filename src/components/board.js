import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  updateTurn,
  updateBoard,
  detectAndMergeGroups,
  countLiberties,
  captureGroups,
} from '../actions/index'
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

    this.props.updateBoard(x, y, whosTurn)
    this.props.detectAndMergeGroups(x, y, whosTurn)
    this.props.countLiberties(whosTurn)
    this.props.captureGroups(whosTurn)
    this.props.updateTurn()

    return whosTurn
  }

  handleCheckTurn() {
    return this.props.game.whosTurn
  }

  renderRow(row, y) {
    return (
      <tr key={y}>
        {row.map((node, x) => {
          return (
            <BoardNode
              key={`${x}-${y}`}
              x={x}
              y={y}
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
  const actions = {
    updateTurn,
    updateBoard,
    detectAndMergeGroups,
    countLiberties,
    captureGroups,
  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)