import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Row, Col } from 'antd'

import { placeStoneOnBoard } from '../actions/index'
import Board from './board/board'

class BoardGame extends Component {
  constructor(props) {
    super(props)

    this.handleOnClick = this.handleOnClick.bind(this)
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

  render() {
    const style = {
      backgroundColor: "#CC9966",
    }

    if (!this.props.board) {
      return <div>Loading...</div>
    }

    return (
      <Row>
        <Col span={24} offset={1}>
          <Board
            type={"game"}
            onClick={this.handleOnClick}
            onCheckTurn={this.handleCheckTurn}
            board={this.props.board.board}
          />
        </Col>
      </Row>
    )
  }
}

function mapStateToProps({ game, board }) {
  return { game, board }
}

function mapDispatchToProps(dispatch) {
  const actions = { placeStoneOnBoard }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardGame)
