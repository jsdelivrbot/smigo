import React, { Component } from 'react'

class BoardNode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      style: {
        width: "75px",
        height: "75px",
        backgroundColor: "#fff",
      }
    }

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  handleMouseOut() {
    const previousStyle = this.state.style

    this.setState({
      style: { ...previousStyle, backgroundColor: "#fff" }
    })
  }

  handleMouseOver() {
    const previousStyle = this.state.style

    this.setState({
      style: { ...previousStyle, backgroundColor: "#fafafa" }
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