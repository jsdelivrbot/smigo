import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { calculateLiberties, checkVicinity, getLibertyCoordinates, belongsToGroup } from '../utils/helpers'

class BoardNode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      x: props.x,
      y: props.y,
      owner: props.owner,
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
    this.checkIllegalMove = this.checkIllegalMove.bind(this)
  }

  handleOnClick() {
    if (this.state.owner || this.checkIllegalMove()) {
      return null
    }

    const { players: { player1, player2 }} = this.props.game
    const { x, y } = this.state
    const backgroundColor = this.props.onChangeTurn(x, y) % 2 === 0 ? player1.color  : player2.color

    this.setState({
      style: {
        ...this.state.style,
        backgroundColor,
        borderRadius: "50%",
        opacity: 1
      }
    })
  }

  componentWillReceiveProps({ owner }) {
    let style = this.state.style

    if (!owner) {
      style = {
        width: "60px",
        height: "60px",
        opacity: 1,
        borderColor: "#000",
        backgroundColor: "#CC9966",
      }
    }

    this.setState({
      owner,
      style
    })
  }

  handleMouseOut() {
    const previousStyle = this.state.style

    let backgroundColor = this.state.style.backgroundColor

    if (!this.state.owner) {
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

    if (!this.state.owner && this.checkIllegalMove()) {
      this.setState({
        style: {
          ...previousStyle,
          backgroundColor: "#f00",
          opacity: 0.5,
        }
      })

      return
    }

    const { whosTurn, players: { player1, player2 }} = this.props.game

    let backgroundColor = whosTurn % 2 ? player1.color : player2.color

    if (this.state.owner) {
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

  checkIllegalMove() {
    const { board, groups } = this.props.board
    const { x, y } = this.state
    const { whosTurn: player } = this.props.game

    const opponent = player % 2 === 0 ? 1 : 2

    let allowKo = false

    if (!groups[player].length) {
      return false
    }

    // loop player's possible groups and
    // check if current stone position matches any existing groups
    let nodeGroups = groups[player].filter((group, index) => checkVicinity(x, y, group))

    if (!nodeGroups.length) {
      nodeGroups.push(`${x}-${y}`)
    }

    nodeGroups = _.flatten(nodeGroups)

    // check if the move is not illegal
    // e.g. liberty count is zero
    const possibleMoveLiberties = getLibertyCoordinates(nodeGroups, { board })
    const mergedGroup = nodeGroups.concat(possibleMoveLiberties)
    const finalLiberties = getLibertyCoordinates(mergedGroup, { board })

    // should check if any of the opponent's groups are in atari
    // if they are in atari, then check if ko is available
    if (finalLiberties.length === possibleMoveLiberties.length) {
      let opponentNodeGroups = groups[opponent].filter((group, index) => checkVicinity(x, y, group))
      opponentNodeGroups = _.flatten(opponentNodeGroups)

      opponentNodeGroups.map(group => {
        if (allowKo) {
          return
        }

        let [coordX, coordY] = group.split("-");

        coordX = Number(coordX)
        coordY = Number(coordY)

        const opponentGroupLiberties = calculateLiberties(coordX, coordY, { board }, [])
          .filter(coordinate => coordinate !== `${x}-${y}`)
          .length

        // allow ko if opponent has no liberties after player's move
        // if opponent's stone belongs to a group, it means a suicidal move which is illegal
        if (opponentGroupLiberties === 0 && !belongsToGroup(coordX, coordY, { board }, opponent)) {
          allowKo = true
        }
      })
    }

    return (finalLiberties.length === possibleMoveLiberties.length && !allowKo) || nodeGroups.length === 0
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
  return {
    game: state.game,
    board: state.board,
  }
}

export default connect(mapStateToProps)(BoardNode)