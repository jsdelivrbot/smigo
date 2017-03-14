import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateTurn, updateBoard } from '../actions/index'
import BoardNode from './board_node'

class Board extends Component {
  constructor(props) {
    super(props)

    this.handleOnClick = this.handleOnClick.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.handleCheckTurn = this.handleCheckTurn.bind(this)
  }

  handleOnClick(x, y) {
    this.props.updateTurn()
    this.props.updateBoard(x, y, this.props.game.whosTurn)

    return this.props.game.whosTurn
  }

  handleCheckTurn() {
    return this.props.game.whosTurn
  }

  renderRow(row, x) {
    return (
      <tr key={x}>
        {row.map((node, y) => {
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
          {this.props.board.map(this.renderRow)}
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

export default connect(mapStateToProps, { updateTurn, updateBoard })(Board)