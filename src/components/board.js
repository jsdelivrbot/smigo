import React, { Component } from 'react'

import BoardNode from './board_node'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      size: props.size,
    }
  }

  renderRow(row, index) {
    return (
      <tr key={index}>
        {row.map(node => <BoardNode key={node} />)}
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

    return (
      <table className="table-bordered">
        <tbody>
          {board.map((row, index) => this.renderRow(row, index))}
        </tbody>
      </table>
    )
  }
}

export default Board