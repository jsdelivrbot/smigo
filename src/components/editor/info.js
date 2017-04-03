import React, { Component } from 'react'
import { Card, Row, Col, Collapse } from 'antd'

const Panel = Collapse.Panel

const rows = [
  [
    { key: "date", title: "Date" },
    { key: "event", title: "Event" },
    { key: "place", title: "Place" },
    { key: "source", title: "Source" },
  ],
  [
    { key: "result", title: "Result" },
    { key: "round", title: "Round" },
    { key: "komi", title: "Komi" },
    { key: "size", title: "Boardsize" },
  ],
  [
    { key: "rules", title: "Rules" },
    { key: "overtime", title: "Overtime" },
    { key: "handicap", title: "Handicap" },
    {},
  ],
]

class Info extends Component {
  constructor(props) {
    super(props)

    this.state = {
      match: props.match,
    }

    this.renderTitle = this.renderTitle.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  renderRow(row, i) {
    return (
      <div key={`div-${i}`}>
        <Row gutter={16} key={i}>
          {row.map((obj, index) => {
            if (obj.length === 0) {
              return <Col className="gutter-row" span="6" key={`${i}-${index}`}></Col>
            }

            return (
              <Col className="gutter-row" span="6" key={`${i}-${index}`}>
                <h6 style={{ fontSize: "12px" }}>{obj.title}</h6>
                <p>{this.state.match[obj.key]}</p>
              </Col>
            )
          })}
        </Row>

        <hr style={{ marginTop: "10px", marginBottom: "10px" }}/>
      </div>
    )
  }

  renderTitle() {
    const { player1, player2 } = this.state.match

    const player1Title = player1.rank ? `${player1.name} ${player1.rank}` : player1.name
    const player2Title = player2.rank ? `${player2.name} ${player2.rank}` : player2.name

    return `${player1Title} vs ${player2Title}`
  }

  render() {
    return (
      <Collapse>
        <Panel header={this.renderTitle()}>
          <Card>
            {rows.map((row, i) => this.renderRow(row, i))}
          </Card>
        </Panel>
      </Collapse>
    )
  }
}

export default Info
