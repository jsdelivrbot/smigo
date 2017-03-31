import React, { Component } from 'react'
import { message, Card, Row, Col, Icon } from 'antd'

import Uploader from './uploader'
import Board from './board/board'
import { generateBoard } from '../utils/helpers'

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = { match: null }

    this.handleUploaderOnChange = this.handleUploaderOnChange.bind(this)
    this.renderInfo = this.renderInfo.bind(this)
    this.renderBoard = this.renderBoard.bind(this)
  }

  handleUploaderOnChange(info) {
    const { status, response: match, name } = info.file

    if (status === 'done') {
      this.setState({ match }, message.success(`${name} file uploaded successfully.`))
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

  renderBoard() {
    // typecast size to integer
    const size = Number(this.state.match.size)

    return (
      <div style={{ display: "inline-block", marginTop: "40px", width: "100%" }}>
        <div style={{ display: "inline-block", marginLeft: "-60px" }}>
          <Board
            type={"editor"}
            onClick={() => {}}
            onCheckTurn={() => {}}
            board={generateBoard(size)}
          />
        </div>
        {this.renderControls()}
      </div>
    )
  }

  renderControls() {
    const style = { fontSize: "20px", margin: "10px" }

    return (
      <Row style={{ marginTop: "20px" }}>
        <Col span={12} offset={6}>
          <Icon type="fast-backward" style={style} />
          <Icon type="caret-left" style={style} />
          <Icon type="caret-right" style={style} />
          <Icon type="fast-forward" style={style} />
        </Col>
      </Row>
    )
  }

  render() {
    console.log(this.state.match)
    if (!this.state.match) return <Uploader onChange={this.handleUploaderOnChange} />

    return (
      <div style={{ textAlign: "center" }}>
        {this.renderInfo()}
        {this.renderBoard()}
      </div>
    )
  }
}

export default Editor
