const convnetjs = require('convnetjs')

const learn = (trainer, net, data, labels) => {
  for(let j = 0; j < 2000; j++){
    labels.map((label, i) => {
      const x = new convnetjs.Vol(data[i])

      trainer.train(x, [label])
    })
  }
}

const predict = (net, data) => {
  const x = new convnetjs.Vol(data)
  const predicted_value = net.forward(x)
  return predicted_value.w[0]
}

const getDataAndLabels = (board) => {
  return board.reduce((accumulator, current, y) => {
    const { coordinates, players } = current.reduce((accumulator, player, x) => {
      if (player) {
        accumulator.coordinates.push([x, y])
        accumulator.players.push(player)
      }

      return accumulator
    }, { coordinates: [], players: [] })

    if (coordinates.length) {
      accumulator.data = accumulator.data.concat(coordinates)
      accumulator.labels = accumulator.labels.concat(players)
    }

    return accumulator
  }, { data: [], labels: [] })
}

const createNet = () => {
  const net = new convnetjs.Net()

  net.makeLayers([
    { type: 'input', out_sx: 1, out_sy: 1, out_depth: 2 },
    { type: 'fc', num_neurons: 6, activation: 'tanh' },
    { type: 'fc', num_neurons: 2, activation: 'tanh' },
    { type: 'regression', num_neurons: 1 }
  ])

  return net
}

const createTrainer = (net) => {
  return new convnetjs.SGDTrainer(net, {
    learning_rate: 0.01,
    momentum: 0.2,
    batch_size: 1,
    l2_decay: 0.001
  })
}

const scoreEstimator = (board) => {
  const { data, labels } = getDataAndLabels(board)

  if (data.length === 0) {
    return false
  }

  const net = createNet()

  const trainer = createTrainer(net)

  learn(trainer, net, data, labels)

  let prediction = []

  board.map((group, y) => {
    group.map((player, x) => {
      const predictValue = predict(net, [x, y])

      if (!prediction[x]) {
        prediction[x] = []
      }

      prediction[x][y] = predictValue
    })
  })

  return prediction
}

module.exports.scoreEstimator = scoreEstimator