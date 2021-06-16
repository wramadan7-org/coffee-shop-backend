/* eslint-disable no-unused-vars */
const joi = require('joi')
const response = require('../helpers/response')
const queryDB = require('../helpers/query')

module.exports = {
  addVariant: async (req, res) => {
    try {
      const schemaVariant = joi.object({
        name: joi.string().required()
      })

      const { value, error } = schemaVariant.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      } else {
        const addVariant = await queryDB.addItem('variants', { ...value })
        if (addVariant.affectedRows) {
          return response(res, 'Variant successfully added', { ...value }, res.status(200).statusCode, true)
        } else {
          return response(res, 'Variant fail added', {}, res.status(500).statusCode, false)
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  allVariant: async (req, res) => {
    try {
      const { search } = req.params

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
        const searching = await queryDB.getItem('variants', searchKey, searchValues)
        if (searching.length) {
          return response(res, `Searching ${searchValues}`, { results: searching }, res.status(200).statusCode, true)
        } else {
          return response(res, `Searching ${searchValues}`, { results: 'No results' }, res.status(200).statusCode, true)
        }
      } else {
        const getVariant = await queryDB.getItem('variants')
        if (getVariant.length) {
          return response(res, 'Variant', { results: getVariant }, res.status(200).statusCode, true)
        } else {
          return response(res, 'Variant', { results: 'No category' }, res.status(200).statusCode, true)
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  updateVariant: async (req, res) => {
    try {
      const { id } = req.params

      const schemaVariant = joi.object({
        name: joi.string()
      })

      const { value, error } = schemaVariant.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      } else {
        const updateVariant = await queryDB.updatePatchItem('variants', { ...value }, { id })
        if (updateVariant.affectedRows) {
          return response(res, 'Variant edited successfully', { results: value }, res.status(200).statusCode, true)
        } else {
          return response(res, 'Fail to update variant', {}, res.status(500).statusCode, false)
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  deleteVariant: async (req, res) => {
    try {
      const { id } = req.params

      const deleteVariant = await queryDB.deleteItem('variants', { id })
      if (deleteVariant.affectedRows) {
        return response(res, `Variant ID ${id} deleted successfully`, {}, res.status(200).statusCode, true)
      } else {
        return response(res, `Delete variant ID ${id} fail to deleted`, {}, res.status(500).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  }
}
