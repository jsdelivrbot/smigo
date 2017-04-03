import React, { Component } from 'react'
import { message, Row, Col, Icon, Button } from 'antd'

import Uploader from './uploader'
import Info from './info'
import Controls from './controls'
import Board from '../board/board'
import { generateBoard } from '../../utils/helpers'

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      autoplay: false,
      autoplayIcon: "caret-right",
      autoplayId: null,
      board: null,
      disabled: {
        backwards: true,
        forwards: false,
      },
      index: null,
      match: null,
    }

    this.cancelAutoplay = this.cancelAutoplay.bind(this)
    this.handleAutoPlay = this.handleAutoPlay.bind(this)
    this.handleBackward = this.handleBackward.bind(this)
    this.handleFastBackward = this.handleFastBackward.bind(this)
    this.handleFastForward = this.handleFastForward.bind(this)
    this.handleForward = this.handleForward.bind(this)
    this.handleUploaderOnChange = this.handleUploaderOnChange.bind(this)
    this.moveNumber = this.moveNumber.bind(this)
    this.parseMove = this.parseMove.bind(this)
    this.renderBoard = this.renderBoard.bind(this)
    this.renderFastForward = this.renderFastForward.bind(this)
    this.updateBoard = this.updateBoard.bind(this)
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

  renderBoard(state) {
    return (
      <div style={{ display: "inline-block", marginTop: "20px", width: "100%" }}>
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
    return (
      <Controls
        disabled={state.disabled}
        autoplayIcon={state.autoplayIcon}
        onClickFastBackward={this.handleFastBackward}
        onClickBackward={this.handleBackward}
        onClickAutoPlay={this.handleAutoPlay}
        onClickForward={this.handleForward}
        onClickFastForward={this.handleFastForward}
      />
    )
  }

  cancelAutoplay() {
    this.setState({ autoplay: false, autoplayIcon: "caret-right" }, clearInterval(this.state.autoplayId))
  }

  handleAutoPlay() {
    if (!this.state.autoplay) {
      const callback = () => {
        const autoplayId = setInterval(() => {
          if (this.state.index === this.state.match.moves.length - 1) {
            this.cancelAutoplay()
          }

          const nextIndex = this.handleForward(null, this.state)

          if (nextIndex === false) {
            this.cancelAutoplay()
          }
          else {
            this.setState({ index: nextIndex })
          }
        }, 1000)

        this.setState({ autoplayId })
      }

      this.setState({ autoplayIcon: "pause", autoplay: true }, callback)
    }
    else {
      this.cancelAutoplay()
    }
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
    this.setState({ board, index: null, disabled: { backwards: true, forwards: false } })
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

    const disabled = {
      backwards: index === null ? true : false,
      forwards: ((index + 1) === state.match.moves.length) ? true : false,
    }

    this.setState({ board, index, disabled })
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

  moveNumber() {
    const move = this.state.index === null ? 0 : this.state.match.moves.slice(0, this.state.index).length + 1

    const style = {
      marginTop: "20px",
      fontSize: "14px",
    }

    return (
      <Row style={style}>
        <Col span={24}>
          Move {move}
        </Col>
      </Row>
    )
  }

  render() {
    if (!this.state.match) return <Uploader onChange={this.handleUploaderOnChange} />

    return (
      <div style={{ textAlign: "center" }}>
        <Info match={this.state.match} />
        {this.moveNumber()}
        {this.renderBoard(this.state)}
      </div>
    )
  }
}

export default Editor
