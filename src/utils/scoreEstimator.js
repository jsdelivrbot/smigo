const convnetjs = require('convnetjs')

const learn = (trainer, net, data, labels) => {
  for(let j = 0; j < 2000; j++){
    for (let i = 0; i < labels.length; i++) {
        let x = new convnetjs.Vol(data[i]);

        let real_value = labels[i]

        trainer.train(x, [real_value]);

        let predicted_values = net.forward(x);
    }
  }
}

const predict = (net, data) => {
  const x = new convnetjs.Vol(data);
  const predicted_value = net.forward(x);
  return predicted_value.w[0];
}

const scoreEstimator = (board) => {
  var net = new convnetjs.Net();

  net.makeLayers([
    { type: 'input', out_sx: 1, out_sy: 1, out_depth: 2 },
    { type: 'fc', num_neurons: 2, activation: 'relu' },
    { type: 'regression', num_neurons: 1 }
  ]);

  let data = []
  let labels = []

  board.map((group, y) => {
    group.map((player, x) => {
      if (player) {
        data.push([x, y])

        labels.push(player)
      }
    })
  })

  if (data.length === 0) {
    return false
  }

  const trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.2, batch_size:1, l2_decay:0.001});

  learn(trainer, net, data, labels);

  let prediction = []

  board.map((group, y) => {
    group.map((player, x) => {
      if (!player) {
        const predictValue = predict(net, [x, y])

        if (!prediction[x]) {
          prediction[x] = []
        }

        prediction[x][y] = predictValue
      }
    })
  })

  return prediction
}

module.exports.scoreEstimator = scoreEstimator