import React, { Component } from 'react'
import { connect } from 'react-redux'

import Board from './board'

class Game extends Component {
  render() {
    return <Board />
  }
}

function mapStateToProps(state) {
  return { game: state.game }
}

export default connect(mapStateToProps)(Game)