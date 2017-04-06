import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Row, Col } from 'antd'

import { placeStoneOnBoard } from '../actions/index'

import { getWhosTurn } from '../selectors/game_selector'
import { getBoardLayout } from '../selectors/board_selector'

import Board from './board/board'

class BoardGame extends Component {
  constructor(props) {
    super(props)

    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleCheckTurn = this.handleCheckTurn.bind(this)
  }

  handleOnClick(x, y) {
    console.log('handleOnClick called')
    this.props.placeStoneOnBoard(x, y, this.props.whosTurn)

    return this.props.whosTurn
  }

  handleCheckTurn() {
    console.log('handleCheckTurn called')
    return this.props.whosTurn
  }

  render() {
    console.log('render called')
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
            board={this.props.board}
          />
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    whosTurn: getWhosTurn(state),
    board: getBoardLayout(state)
  }
}

function mapDispatchToProps(dispatch) {
  const actions = { placeStoneOnBoard }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardGame)
