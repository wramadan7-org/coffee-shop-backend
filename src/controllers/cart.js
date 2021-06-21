/* eslint-disable camelcase */
/* eslint-disable prefer-regex-literals */
const joi = require('joi')
const queryDB = require('../helpers/query')
const response = require('../helpers/response')

module.exports = {
  addCart: async (req, res) => {
    try {
      const { id } = req.user.user
      const cartSchema = joi.object({
        id_item: joi
          .number()
          .required(),
        qty: joi
          .number()
          .min(1)
          .required()
      })

      const { value, error } = cartSchema.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      } else {
        const checkCart = await queryDB.getItemAnd('carts', { id_item: value.id_item }, { id_user: id })
        // cek barang jika sudah ada maka tambah qty dan total
        if (checkCart.length) {
          const changeQty = await parseInt(checkCart[0].qty) + parseInt(value.qty)
          const checkPriceItem = await queryDB.detailItem('items', { id: value.id_item })
          const changeTotal = await changeQty * parseInt(checkPriceItem[0].price)
          const data = {
            ...value,
            id_user: id,
            qty: changeQty,
            subtotal: changeTotal
          }
          const changed = await queryDB.updatePatchItem('carts', { ...data }, { id: checkCart[0].id })
          // console.log(changed)
          if (changed.affectedRows) {
            return response(res, 'Add to cart successfully', { results: data }, res.status(200).statusCode, true)
          } else {
            return response(res, 'Item not found', {}, res.status(404).statusCode, false)
          }
        } else {
          // jika barang belum ada maka tambah biasa
          const checkPriceItem = await queryDB.detailItem('items', { id: value.id_item })
          if (checkPriceItem.length) {
            const perPrice = checkPriceItem[0].price
            const subtotal = value.qty * perPrice

            const data = {
              ...value,
              id_user: id,
              subtotal
            }

            const addCart = await queryDB.addItem('carts', { ...data })

            if (addCart.affectedRows) {
              return response(res, 'Add to cart successfully', { results: data }, res.status(200).statusCode, true)
            }
          } else {
            return response(res, 'Item not found', {}, res.status(404).statusCode, false)
          }
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  getCart: async (req, res) => {
    try {
      const { id } = req.user.user
      const selected = 'items.id, items.name, categories.name AS category, variants.name AS variant, sizes.size, items.description, items.price, images.image, carts.qty, carts.subtotal'
      const from = `(((((carts INNER JOIN items ON carts.id_item = items.id) LEFT JOIN categories ON items.id_category = categories.id) LEFT JOIN variants ON items.id_variant = variants.id) LEFT JOIN sizes ON items.id_size = sizes.id) LEFT JOIN images ON items.id_image = images.image) WHERE carts.id_user = ${id}`
      const joined = await queryDB.selectDataJoin(selected, from)

      if (joined.length) {
        return response(res, 'Cart', { results: joined }, res.status(200).statusCode, true)
      } else {
        return response(res, 'You dont have cart', { results: joined }, res.status(200).statusCode, true)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  updateCart: async (req, res) => {
    try {
      const { id } = req.params
      const { user } = req.user

      const updateShcema = joi.object({
        qty: joi
          .number()
          // .regex(new RegExp('^[0-9]+$'))
          .min(1)
      })

      const { value, error } = updateShcema.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      } else {
        const checkCart = await queryDB.detailItem('carts', { id })

        if (checkCart.length) {
          if (user.id === checkCart[0].id_user) {
            let subtotal = checkCart[0].subtotal

            if (value.qty !== checkCart[0].qty) {
              const checkPerItem = await queryDB.detailItem('items', { id: checkCart[0].id_item })
              console.log(checkPerItem)
              subtotal = value.qty * parseInt(checkPerItem[0].price)
            }
            const data = {
              qty: value.qty || checkCart[0].qty,
              subtotal
            }

            const updateCart = await queryDB.updatePatchItem('carts', { ...data }, { id })
            if (updateCart.affectedRows) {
              return response(res, 'Cart successfully updated', { results: data }, res.status(200).statusCode, true)
            } else {
              return response(res, 'Cart fail to updated', {}, res.status(500).statusCode, false)
            }
          }
        } else {
          return response(res, `You don't have cart by ID ${id}`, {}, res.status(404).statusCode, false)
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  deleteCart: async (req, res) => {
    try {
      const { user } = req.user
      const { id } = req.params

      const checkingYourCart = await queryDB.detailItem('carts', { id })
      if (checkingYourCart.length) {
        if (checkingYourCart[0].id_user === user.id) {
          const deleting = await queryDB.deleteItem('carts', { id })

          if (deleting.affectedRows) {
            return response(res, `Cart ID ${id} deleted`, {}, res.status(200).statusCode, true)
          } else {
            return response(res, `Cart ID ${id} fail to delete`, {}, res.status(500).statusCode, false)
          }
        } else {
          return response(res, `You don't have cart by ID ${id}`, {}, res.status(404).statusCode, false)
        }
      } else {
        return response(res, `You don't have cart by ID ${id}`, {}, res.status(404).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  }
}
