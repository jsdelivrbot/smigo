import React, { Children, Component } from 'react'

import BoardHead from './board_head'
import BoardBody from './board_body'

const style = {
  backgroundColor: "#CC9966",
}

class Board extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { type, board, onClick, onCheckTurn, children } = this.props

    return (
      <table className="table-bordered" style={style}>
        <BoardHead>
          {board[0]}
        </BoardHead>
        <BoardBody onClick={onClick} onCheckTurn={onCheckTurn} type={type}>
          {board}
        </BoardBody>
      </table>

    )
  }
}

export default Board
