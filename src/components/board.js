import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateTurn } from '../actions/index'
import BoardNode from './board_node'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      size: props.size,
    }

    this.handleOnClick = this.handleOnClick.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.handleCheckTurn = this.handleCheckTurn.bind(this)
  }

  handleOnClick() {
    this.props.updateTurn()

    return this.props.game.whosTurn
  }

  handleCheckTurn() {
    return this.props.game.whosTurn
  }

  renderRow(row, index) {
    return (
      <tr key={index}>
        {row.map(node => {
          return (
            <BoardNode
              key={node}
              onChangeTurn={this.handleOnClick}
              onCheckTurn={this.handleCheckTurn}
            />
          )
        })}
      </tr>
    )
  }

  render() {
    let board = []

    for(let x = 0; x < this.state.size; x++) {
      board[x] = []
      for(let y = 0; y < this.state.size; y++) {
        board[x][y] = `${x}-${y}`
      }
    }

    const style = {
      backgroundColor: "#CC9966",
    }

    return (
      <table className="table-bordered" style={style}>
        <tbody>
          {board.map(this.renderRow)}
        </tbody>
      </table>
    )
  }
}

function mapStateToProps(state) {
  return { game: state.game }
}

export default connect(mapStateToProps, { updateTurn })(Board)