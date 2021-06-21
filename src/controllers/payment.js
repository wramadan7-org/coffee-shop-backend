const response = require('../helpers/response')
const randomCode = require('../helpers/code')
const queryDB = require('../helpers/query')

module.exports = {
  addPayment: async (req, res) => {
    try {
      const { user } = req.user
      const nota = await randomCode(10)
      console.log(nota)
      const checkCart = await queryDB.detailItem('carts', { id_user: user.id })
      console.log(checkCart.length)
      if (checkCart.length) {
        const set = 'id_item, qty, subtotal, id_user, nota'
        // get data for values array in sql
        const mapingCart = checkCart.map(item => {
          const destructing = { ...item }
          const destructingDataCart = `(${destructing.id_item}, ${destructing.qty}, ${destructing.subtotal}, ${destructing.id_user}, '${nota}')`
          return destructingDataCart
        })

        // get data subtotal for sum total in field total table payment
        const sumTotal = checkCart.map(maps => {
          const destructing = { ...maps }
          const subtotal = parseInt(destructing.subtotal)
          return subtotal
        })
        // .reduce() for sum all number in field subtotal
        const total = [...sumTotal].reduce((a, b) => a + b, 0)

        const dataPayment = {
          nota, total
        }

        const addToPayment = await queryDB.addItem('payments', { ...dataPayment })

        if (addToPayment.affectedRows) {
          const addToHistory = await queryDB.addItemWithValues('histories', set, mapingCart)

          if (addToHistory.affectedRows) {
            const deletingYourCart = await queryDB.deleteItem('carts', { id_user: user.id })
            if (deletingYourCart.affectedRows) {
              return response(res, 'Payment successfully', { results: dataPayment }, res.status(200).statusCode, true)
            } else {
              return response(res, 'Fail to move your cart in histories', {}, res.status(500).statusCode, false)
            }
          } else {
            return response(res, 'Fail to add in table histories', {}, res.status(500).statusCode, false)
          }
        } else {
          return response(res, 'Proccess checkout fail', {}, res.status(500).statusCode, false)
        }
      } else {
        return response(res, 'You don\'t have cart', {}, res.status(404).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  }
}
