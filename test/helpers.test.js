import chai from 'chai'

import { 
  belongsToGroup,
  calculateLiberties,
  checkVicinity,
  getLibertyCoordinates,
  iterateGroups,
  mergeGroups,
  playerGroupLiberties,
  reduceOpponentLibertyGroups,
  updateBoard,
  vicinity,
} from '../src/utils/helpers'

const expect = chai.expect
const should = chai.should

describe('helpers', () => {
  it('should return correct vicinity', () => {
    const x = 1
    const y = 1

    const vicinityMock = {
      up: `${x}-${y - 1}`,
      down: `${x}-${y + 1}`,
      left: `${x - 1}-${y}`,
      right: `${x + 1}-${y}`,
    }

    const vicinityReal = vicinity(x, y)

    expect(vicinityReal.up).to.be.equal(vicinityMock.up)
    expect(vicinityReal.down).to.be.equal(vicinityMock.down)
    expect(vicinityReal.left).to.be.equal(vicinityMock.left)
    expect(vicinityReal.right).to.be.equal(vicinityMock.right)

    const vicinityFailMock = {
      up: `${x}-${y - 2}`,
      down: `${x}-${y + 2}`,
      left: `${x - 2}-${y}`,
      right: `${x + 2}-${y}`,
    }

    expect(vicinityReal.up).to.not.be.equal(vicinityFailMock.up)
    expect(vicinityReal.down).to.not.be.equal(vicinityFailMock.down)
    expect(vicinityReal.left).to.not.be.equal(vicinityFailMock.left)
    expect(vicinityReal.right).to.not.be.equal(vicinityFailMock.right)
  })

  it('should check vicinity', () => {
    const x = 1
    const y = 1

    const groupInVicinity = ["0-1"]

    expect(checkVicinity(x, y, groupInVicinity)).to.be.true

    const groupNotInVicinity = ["0-0"]

    expect(checkVicinity(x, y, groupNotInVicinity)).to.be.false
  })

  it('should merge groups', () => {
    const groups = [
      ["0-0"],
      ["0-1"],
      ["1-0"],
      ["3-3"],
    ]

    const indexes = [0, 1, 2]

    const mergedGroups = mergeGroups(indexes, groups)

    expect(mergedGroups).to.be.an('array')
    expect(mergedGroups).to.include.deep.members([["3-3"]])
    expect(mergedGroups).to.include.deep.members([["0-0", "0-1", "1-0"]])

    expect(mergedGroups).to.not.include.deep.members([["0-0", "0-1", "1-0", "3-3"]])
  })

  it('should update board', () => {
    const x = 1
    const y = 1
    const player = 1
    const state = {
      board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    }

    const updatedBoard = updateBoard({ x, y, player }, state)

    expect(updatedBoard).to.include.deep.members([[0, 1, 0]])
    expect(updatedBoard).to.not.include.deep.members([[0, 0, 1]])
  })

  it('should iterate groups', () => {
    const x = 1
    const y = 1
    const player = 1

    const groups = [
      ["0-1"],
      ["1-0"],
      ["3-3"],
    ]

    const [iteratedGroups, indexes] = iterateGroups({ x, y, player }, groups)

    expect(iteratedGroups).to.include.deep.members([["0-1", "1-1"]])
    expect(iteratedGroups).to.include.deep.members([["1-0", "1-1"]])

    expect(indexes).to.include(0)
    expect(indexes).to.include(1)
    expect(indexes).to.not.include(2)
  })

  it('should calculate liberties', () => {
    const x = 1
    const y = 1
    const liberties = []
    const state = {
      board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    }

    const calculatedLiberties = calculateLiberties(x, y, state, liberties)

    // expect these coordinates
    // [0, 1, 0],
    // [1, 0, 1],
    // [0, 1, 0]

    expect(calculatedLiberties).to.eql(["1-0", "1-2", "0-1", "2-1"])
  })

  it('should belong to a group', () => {
    const x = 1
    const y = 1
    const player = 1
    const state = {
      board: [
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    }

    // [1-1] should belong to group [0-1] after [1-1] stone is placed on the board
    expect(belongsToGroup(x, y, state, player)).to.be.true

    // [2-2] should not belong to any group
    expect(belongsToGroup(2, 2, state, player)).to.be.false
  })

  it('should return liberty coordinates', () => {
    const state = {
      board: [
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]
    }

    const group = ["0-1"]

    const libertyCoordinates = getLibertyCoordinates(group, state)

    expect(libertyCoordinates).to.eql(["0-0", "0-2", "1-1"])
  })

  it('should return player group liberties', () => {
    const state = {
      board: [
        [0, 1, 0],
        [0, 0, 1],
        [0, 2, 0]
      ]
    }

    const playerGroups = [
      ["0-1"],
      ["1-2"],
    ]

    const liberties = playerGroupLiberties(playerGroups, state)

    expect(liberties).to.include.deep.members([[["0-1"], 3]])
    expect(liberties).to.include.deep.members([[["1-2"], 3]])
  })

  it('should reduce opponent liberty groups', () => {
    const action = {
      payload: {
        player: 1
      }
    }

    const state = {
      board: [
        [0, 1, 2],
        [0, 0, 1],
        [0, 0, 0]
      ],
      prisoners: {
        1: 5
      },
      liberties: {
        2: [
          [
            ["0-2"],
            0
          ]
        ]
      }
    }

    const [opponentLibertyGroups, prisoners, board] = reduceOpponentLibertyGroups(state, action)

    // expect this kind of board after capture
    // [0, 1, 0],
    // [0, 0, 1],
    // [0, 0, 0]

    expect(opponentLibertyGroups).to.be.empty
    expect(prisoners).to.equal(6)
    expect(board).to.eql([[0, 1, 0], [0, 0, 1], [0, 0, 0]])
  })
})