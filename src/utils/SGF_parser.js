const fs = require('fs')

const defaultValues = {
  size: null,
  event: null,
  round: null,
  player1: {
    name: null,
    rank: null,
  },
  player2: {
    name: null,
    rank: null,
  },
  komi: null,
  date: null,
  place: null,
  result: null,
  source: null,
  moves: null,
}

const mapKeys = (key, value, obj) => {
  switch(key) {
  case 'SZ':
    obj.size = value
    break
  case 'EV':
    obj.event = value
    break
  case 'RO':
    obj.round = value
    break
  case 'PB':
    obj.player1.name = value
    break
  case 'BR':
    obj.player1.rank = value
    break
  case 'PW':
    obj.player2.name = value
    break
  case 'WR':
    obj.player2.rank = value
    break
  case 'KM':
    obj.komi = value
    break
  case 'DT':
    obj.date = value
    break
  case 'PC':
    obj.place = value
    break
  case 'RE':
    obj.result = value
    break
  case 'SO':
    obj.source = value
    break
  }

  return obj
}

const parseGameInfo = info => {
  return info.reduce((prev, cur) => {
    if (cur.length > 0) {
      const regex = /\[([^\]]+)\]/
      const matches = regex.exec(cur)
      const value = matches !== null ? matches[1] : ""

      prev = mapKeys(cur.slice(0, 2), value, prev)
    }

    return prev
  }, defaultValues)
}

const SGFParser = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {

      if (err) {
        reject('error while reading the file')
      }

      const splitData = data.split(';')
      const gameInfo = splitData[1].split('\n')

      const parsedInfo = parseGameInfo(gameInfo)

      // clean moves data
      parsedInfo.moves = splitData
        .slice(2, -1)
        .map(move => move.replace(/(\r\n|\n|\r)/gm, ""))

      resolve(parsedInfo)
    })
  })
}

module.exports.SGFParser = SGFParser
