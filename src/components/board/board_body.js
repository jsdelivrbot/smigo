import React, { Children, Component } from 'react'

import BoardNode from './board_node'

const renderRow = ({ row, x, onClick, onCheckTurn, type }) => {
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
      {row.map((owner, y) => {
        return (
            <BoardNode
              key={`${x}-${y}`}
              x={x}
              y={y}
              owner={owner}
              type={type}
              onChangeTurn={onClick}
              onCheckTurn={onCheckTurn}
            />
        )
      })}
    </tr>
  )
}


class BoardBody extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { onClick, onCheckTurn, type, children } = this.props

    return (
      <tbody>
        {children.map((row, x) => renderRow({ row, x, onClick, onCheckTurn, type }))}
      </tbody>
    )
  }
}

export default BoardBody
