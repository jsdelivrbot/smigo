import React, { Component } from 'react'
import { Card, Row, Col } from 'antd'

class Info extends Component {
  constructor(props) {
    super(props)

    this.state = {
      match: props.match,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  render() {
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

        <hr style={{ marginTop: "10px", marginBottom: "10px" }}/>

        <Row gutter={16} style={{ marginTop: "10px" }}>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Rules</h6>
            <p>{this.state.match.rules}</p>
          </Col>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Overtime</h6>
            <p>{this.state.match.overtime}</p>
          </Col>
          <Col className="gutter-row" span="6">
            <h6 style={{ fontSize: "12px" }}>Handicap</h6>
            <p>{this.state.match.handicap}</p>
          </Col>
          <Col className="gutter-row" span="6">
          </Col>
        </Row>
      </Card>
    )
  }
}

export default Info
