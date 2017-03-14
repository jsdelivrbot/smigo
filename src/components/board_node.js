import React, { Component } from 'react'
import { connect } from 'react-redux'

class BoardNode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      clicked: false,
      x: props.x,
      y: props.y,
      style: {
        width: "60px",
        height: "60px",
        opacity: 1,
        borderColor: "#000",
        backgroundColor: "#CC9966",
      }
    }

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  handleOnClick() {
    if (this.state.clicked) {
      return null
    }

    const { players: { player1, player2 }} = this.props.game
    const { x, y } = this.state
    const backgroundColor = this.props.onChangeTurn(x, y) ? player2.color  : player1.color

    this.setState({
      clicked: true,
      style: {
        ...this.state.style,
        backgroundColor,
        borderRadius: "50%",
        opacity: 1
      }
    })
  }

  handleMouseOut() {
    const previousStyle = this.state.style

    let backgroundColor = this.state.style.backgroundColor

    if (!this.state.clicked) {
      backgroundColor = "#CC9966"
    }

    this.setState({
      style: {
        ...previousStyle,
        backgroundColor,
        opacity: 1
      }
    })
  }

  handleMouseOver() {
    const previousStyle = this.state.style
    const { whosTurn, players: { player1, player2 }} = this.props.game

    let backgroundColor = whosTurn ? player2.color  : player1.color

    if (this.state.clicked) {
      backgroundColor = this.state.style.backgroundColor
    }

    this.setState({
      style: {
        ...previousStyle,
        backgroundColor,
        opacity: 0.5,
        borderRadius: "50%"
      }
    })
  }

  render() {
    return (
      <td style={this.state.style}
        onClick={this.handleOnClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}>
      </td>
    )
  }
}


function mapStateToProps(state) {
  return { game: state.game }
}

export default connect(mapStateToProps)(BoardNode)