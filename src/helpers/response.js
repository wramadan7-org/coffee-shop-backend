module.exports = (response, message, data, status, success = true) => {
  return response.send({
    success,
    message: message || 'no message',
    status,
    ...data
  })
}
