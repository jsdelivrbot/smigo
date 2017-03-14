import React, { Component } from 'react'

const boardColor = "#CC9966"

class BoardNode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      style: {
        width: "75px",
        height: "75px",
        backgroundColor: boardColor,
        opacity: 1,
      }
    }

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  handleMouseOut() {
    const previousStyle = this.state.style

    this.setState({
      style: { ...previousStyle, opacity: 1 }
    })
  }

  handleMouseOver() {
    const previousStyle = this.state.style

    this.setState({
      style: { ...previousStyle, opacity: 0.9 }
    })
  }

  render() {
    return (
      <td style={this.state.style}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}>
      </td>
    )
  }
}

export default BoardNode