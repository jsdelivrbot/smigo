const jwt = require('jsonwebtoken')
const cert = require('../../secret').secretKey  // get private key

const generateToken = (payload) => {
  return jwt.sign(payload, cert)
}

module.exports.generateToken = generateToken
