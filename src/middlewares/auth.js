require('dotenv').config()
const jwt = require('jsonwebtoken')
const response = require('../helpers/response')

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.slice(7, authorization.length)
      jwt.verify(token, process.env.APP_KEY, (err, decode) => {
        if (err) {
          return response(res, 'Unauthorization', {}, res.status(401).statusCode, false)
        } else {
          req.user = decode
          next()
        }
      })
    } catch (err) {
      return response(res, err, {}, res.status(500).statusCode, false)
    }
  } else {
    return response(res, 'Forbidden access', {}, res.status(403).statusCode, false)
  }
}
