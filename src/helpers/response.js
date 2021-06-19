module.exports = (response, message, data, status, success = true) => {
  return response.send({
    success,
    message: message || 'Error',
    status,
    ...data
  })
}
