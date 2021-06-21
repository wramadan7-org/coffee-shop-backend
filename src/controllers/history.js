const response = require('../helpers/response')
const queryDB = require('../helpers/query')

module.exports = {
  getHistoryPayments: async (req, res) => {
    try {
      const { user } = req.user
      const selected = 'histories.id, histories.nota, images.image, items.name, histories.qty, histories.subtotal, payments.total'
      const from = `(((histories LEFT JOIN payments ON histories.nota = payments.nota) LEFT JOIN items ON histories.id_item = items.id) LEFT JOIN images ON items.id_image = images.image) WHERE histories.id_user = ${user.id}`
      const getHistory = await queryDB.selectDataJoin(selected, from)

      if (getHistory.length) {
        return response(res, 'Your history', { results: getHistory }, res.status(200).statusCode, true)
      } else {
        return response(res, 'You don\'t have bought any item', {}, res.status(404).statusCode, true)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  deleteHistoryById: async (req, res) => {
    try {
      const { user } = req.user
      const { id } = req.params

      const getDetailHistory = await queryDB.detailItem('histories', { id })

      if (getDetailHistory.length) {
        const checkUser = getDetailHistory[0].id_user

        if (checkUser === user.id) {
          const deleting = await queryDB.deleteItem('histories', { id })

          if (deleting.affectedRows) {
            return response(res, `Delete history ID ${id} successfully`, {}, res.status(200).statusCode, true)
          } else {
            return response(res, `Delete history ID ${id} failed`, {}, res.status(500).statusCode, false)
          }
        } else {
          return response(res, `You dont have history ID ${id}`, {}, res.status(400).statusCode, false)
        }
      } else {
        return response(res, `You don't have history ID ${id}`, {}, res.status(400).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  deleteAllYourHistory: async (req, res) => {
    try {
      const { user } = req.user

      const deleting = await queryDB.deleteItem('histories', { id_user: user.id })

      if (deleting.affectedRows) {
        return response(res, 'Delete successfully', {}, res.status(200).statusCode, true)
      } else {
        return response(res, 'Fail to delete', {}, res.status(500).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  }
}
