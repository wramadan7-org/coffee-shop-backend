const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const randomed = async (length) => {
  let results = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    results += await characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return await results
}

module.exports = randomed
