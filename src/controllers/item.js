/* eslint-disable no-unused-vars */
/* eslint-disable prefer-regex-literals */
const response = require('../helpers/response')
const joi = require('joi')
const queryDB = require('../helpers/query')

module.exports = {
  addItem: async (req, res) => {
    try {
      const schemaItem = joi.object({
        name: joi
          .string()
          .required(),
        description: joi
          .string()
          .required(),
        price: joi
          .string()
          .trim()
          .regex(new RegExp('^[0-9]+$'))
          .required(),
        category: joi
          .number()
          .required(),
        size: joi
          .number()
          .required(),
        image: joi
          .number()
          .required(),
        variant: joi
          .number()
          .required()
      })

      const { value, error } = schemaItem.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      } else {
        const data = {
          name: value.name,
          id_category: value.category,
          id_variant: value.variant,
          id_size: value.size,
          id_image: value.image,
          description: value.description,
          price: value.price
        }
        const addItem = await queryDB.addItem('items', { ...data })
        if (addItem.affectedRows) {
          return response(res, 'Item successfully added!', { results: value }, res.status(res.status(200).statusCode).statusCode, true)
        } else {
          return response(res, 'Fail to added item', {}, res.status(500).statusCode, false)
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  allItem: async (req, res) => {
    try {
      // const search = req.query
      const { search } = req.query
      console.log(search)
      let searchKey = ''
      let searchValues = ''

      if (typeof search === 'object') {
        searchKey = Object.keys(search)[0]
        searchValues = Object.values(search)[0]
      } else {
        searchKey = 'name'
        searchValues = search || ''
      }

      if (search) {
        const searching = await queryDB.getItem('items', searchKey, searchValues)
        if (searching.length) {
          return response(res, `Searching ${searchValues}`, { results: searching }, res.status(200).statusCode, true)
        } else {
          return response(res, `Searching ${searchValues}`, { results: 'No results' }, res.status(200).statusCode, true)
        }
      } else {
        // const getItem = await queryDB.getItem('items')
        const getItem = await queryDB.getItemJoin()
        if (getItem.length) {
          return response(res, 'Item', { results: getItem }, res.status(res.status(200).statusCode).statusCode, true)
        } else {
          return response(res, 'Item', { results: 'No item' }, res.status(res.status(200).statusCode).statusCode, true)
        }
      }

      // if (Object.keys(search).length > 0) {
      //   const searchByName = Object.values(search)[0]
      // const searching = await queryDB.getItem('items', 'name', searchByName)
      // return response(res, `Searching ${searchByName}`, { results: searching }, res.status(200).statusCode, true)
      // } else if (Object.keys(search).length < 1) {
      //   // console.log(searchByName)
      // const getItem = await queryDB.getItem('items')
      // return response(res, 'Item', { results: getItem }, res.status(200).statusCode, true)
      // }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  detailItem: async (req, res) => {
    try {
      const { id } = req.params
      // console.log(req.params)

      const detail = await queryDB.getItemDetailJoin('items', { ...id })
      return response(res, `Detail item ID ${id}`, { results: detail[0] }, res.status(200).statusCode, true)
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  updateItem: async (req, res) => {
    try {
      const { id } = req.params

      const schemaUpdate = joi.object({
        name: joi
          .string(),
        description: joi
          .string(),
        price: joi
          .string()
          .trim()
          .regex(new RegExp('^[0-9]+$')),
        category: joi
          .number(),
        size: joi
          .number(),
        image: joi
          .number(),
        variant: joi
          .number()
      })

      const { value, error } = schemaUpdate.validate(req.body)

      if (error) {
        // console.log(error)
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      }

      const checkItem = await queryDB.detailItem('items', { id })
      console.log('waaw', checkItem[0])
      const data = {
        name: value.name || checkItem[0].name,
        id_category: value.category || checkItem[0].id_category,
        id_variant: value.variant || checkItem[0].id_variant,
        id_size: value.size || checkItem[0].id_size,
        id_image: value.image || checkItem[0].id_image,
        description: value.description || checkItem[0].description,
        price: value.price || checkItem[0].price
      }

      console.log('data', data)
      console.log('value', value)

      const updateItem = await queryDB.updatePatchItem('items', { ...data }, { id })

      // console.log(updateItem)
      if (updateItem.affectedRows) {
        return response(res, 'Update item successfully', { results: value }, res.status(200).statusCode, true)
      } else {
        return response(res, 'Fail to update item', {}, res.status(406).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params

      // console.log(id)
      const deleteItem = await queryDB.deleteItem('items', { id: id })
      // console.log(deleteItem)
      if (deleteItem.affectedRows) {
        return response(res, `Item ID ${id} successfully deleted`, {}, res.status(200).statusCode, true)
      } else {
        return response(res, `Item ID ${id} fail to deleted`, {}, res.status(400).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  }
}
