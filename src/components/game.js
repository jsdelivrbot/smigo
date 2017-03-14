import React, { Component } from 'react'
import { connect } from 'react-redux'

import Board from './board'

class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      boardSize: 9,
      players: {
        "player1": {
          color: "#000"
        },
        "player2": {
          color: "#fff"
        }
      }
    }
  }

  render() {
    return <Board size={this.state.boardSize} />
  }
}

function mapStateToProps(state) {
  return { game: state.game }
}

export default connect(mapStateToProps)(Game)