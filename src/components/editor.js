import React, { Component } from 'react'
import { message, Card, Row, Col, Icon, Button } from 'antd'

import Uploader from './uploader'
import Board from './board/board'
import { generateBoard } from '../utils/helpers'

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      match: null,
      index: null,
      board: null,
    }

    this.handleUploaderOnChange = this.handleUploaderOnChange.bind(this)
    this.renderInfo = this.renderInfo.bind(this)
    this.renderBoard = this.renderBoard.bind(this)
    this.handleForward = this.handleForward.bind(this)
    this.handleFastForward = this.handleFastForward.bind(this)
    this.handleBackward = this.handleBackward.bind(this)
    this.handleFastBackward = this.handleFastBackward.bind(this)
    this.parseMove = this.parseMove.bind(this)
    this.updateBoard = this.updateBoard.bind(this)
    this.renderFastForward = this.renderFastForward.bind(this)
  }

  handleUploaderOnChange(info) {
    const { status, response: match, name } = info.file

    if (status === 'done') {
      // typecast size to integer
      const size = Number(match.size)
      const board = generateBoard(size)

      this.setState({ match, board }, message.success(`${name} file uploaded successfully.`))
    }
    else if (status === 'error') {
      message.error(`${name} file upload failed.`)
    }
  }

  renderInfo() {
    const { player1, player2, size } = this.state.match
    const player1Title = player1.rank ? `${player1.name} ${player1.rank}` : player1.name
    const player2Title = player2.rank ? `${player2.name} ${player2.rank}` : player2.name
    const title = `${player1Title} vs ${player2Title}`

    return (
      <Card title={title}>
        <Row gutter={16}>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Date</h6>
            <p>{this.state.match.date}</p>
          </Col>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Event</h6>
            <p>{this.state.match.event}</p>
          </Col>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Place</h6>
            <p>{this.state.match.place}</p>
          </Col>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Source</h6>
            <p>{this.state.match.source}</p>
          </Col>
        </Row>
        <hr style={{ marginTop: "10px", marginBottom: "10px" }}/>
        <Row gutter={16} style={{ marginTop: "10px" }}>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Result</h6>
            <p>{this.state.match.result}</p>
          </Col>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Round</h6>
            <p>{this.state.match.round}</p>
          </Col>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Komi</h6>
            <p>{this.state.match.komi}</p>
          </Col>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Boardsize</h6>
            <p>{size}x{size}</p>
          </Col>
        </Row>
      </Card>
    )
  }

  renderBoard(state) {
    return (
      <div style={{ display: "inline-block", marginTop: "40px", width: "100%" }}>
        <div style={{ display: "inline-block", marginLeft: "-60px" }}>
          <Board
            type={"editor"}
            onClick={() => {}}
            onCheckTurn={() => {}}
            board={state.board}
          />
        </div>
        {this.renderControls(state)}
      </div>
    )
  }

  renderControls(state) {
    const style = { margin: "10px" }

    const disabled = {
      backwards: state.index === null ? true : false,
      forwards: ((state.index + 1) === state.match.moves.length) ? true : false,
    }

    return (
      <Row style={{ marginTop: "20px" }}>
        <Col span={12} offset={6}>
          <Button
            shape="circle"
            icon="fast-backward"
            size="large"
            style={style}
            disabled={disabled.backwards}
            onClick={this.handleFastBackward}
          />
          <Button
            shape="circle"
            icon="caret-left"
            size="large"
            style={style}
            disabled={disabled.backwards}
            onClick={this.handleBackward}
          />
          <Button
            shape="circle"
            icon="caret-right"
            size="large"
            style={style}
            disabled={disabled.forwards}
            onClick={this.handleForward}
          />
          <Button
            shape="circle"
            icon="fast-forward"
            size="large"
            style={style}
            disabled={disabled.forwards}
            onClick={this.handleFastForward}
          />
        </Col>
      </Row>
    )
  }

  handleForward(event, state = null) {
    state = !state ? this.state : state

    const { match, index } = state
    let nextIndex = index === null ? 0 : index + 1

    if (nextIndex === match.moves.length) {
      this.renderControls(state)
      return false
    }

    return this.updateBoard(state, nextIndex)
  }

  handleFastBackward() {
    const { size } = this.state.match
    const board = generateBoard(Number(size))
    this.setState({ board, index: null })
  }

  handleFastForward() {
    this.renderFastForward(this.state, this.handleForward)
  }

  renderFastForward(state, callback) {
    const moves = state.match.moves

    moves.map((val, index) => {
      const nextIndex = callback(null, state)

      state.index = nextIndex === false ? state.index : nextIndex
    })

    this.setState({ index: state.index })
  }

  handleBackward() {
    const { index } = this.state
    let nextIndex = index < 0 ? null : index - 1

    this.updateBoard(this.state, nextIndex)
  }

  parseMove(state, index) {
    const { match } = state

    const move = match.moves[index].slice(2, 4)
    const player = match.moves[index].slice(0, 1) === "B" ? 1 : 2

    const [x, y] = move.split("")

    return [player, x.charCodeAt(0) - 97, y.charCodeAt(0) - 97]
  }

  updateBoard(state, index) {
    let board = state.board

    if (state.index === null || index > state.index) {
      const [player, x, y] = this.parseMove(state, index)

      board = this.addMove({ player, x, y, board })
    }

    if (index === null || index < state.index) {
      index = index === null ? 0 : index + 1

      const [player, x, y] = this.parseMove(state, index)

      board = this.removeMove({ x, y, board })
      index = index === 0 ? null : index - 1
    }

    this.setState({ board, index })
    return index
  }

  addMove({ player, x, y, board }) {
    board[y][x] = player

    return board
  }

  removeMove({ x, y, board }) {
    board[y][x] = 0

    return board
  }

  render() {
    if (!this.state.match) return <Uploader onChange={this.handleUploaderOnChange} />

    return (
      <div style={{ textAlign: "center" }}>
        {this.renderInfo()}
        {this.renderBoard(this.state)}
      </div>
    )
  }
}

export default Editor
