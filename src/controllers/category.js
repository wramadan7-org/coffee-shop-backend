/* eslint-disable no-unused-vars */
const joi = require('joi')
const queryDB = require('../helpers/query')
const response = require('../helpers/response')

module.exports = {
  addCategory: async (req, res) => {
    try {
      const schemaCategory = joi.object({
        name: joi.string().required()
      })

      const { value, error } = schemaCategory.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      } else {
        const addCategory = await queryDB.addItem('categories', { ...value })

        if (addCategory.affectedRows) {
          return response(res, 'Category successfully added', { results: value }, res.status(200).statusCode, true)
        } else {
          return response(res, 'Category fail to added', {}, res.status(500).statusCode, false)
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  allCategory: async (req, res) => {
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
        const searching = await queryDB.getItem('categories', searchKey, searchValues)
        if (searching.length) {
          return response(res, `Searching ${searchValues}`, { results: searching }, res.status(200).statusCode, true)
        } else {
          return response(res, `Searching ${searchValues}`, { results: 'No results' }, res.status(200).statusCode, true)
        }
      } else {
        const getCategory = await queryDB.getItem('categories')
        if (getCategory.length) {
          return response(res, 'Categories', { results: getCategory }, res.status(200).statusCode, true)
        } else {
          return response(res, 'Categories', { results: 'No category' }, res.status(200).statusCode, true)
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  // ini detail category isinya semua item yg category itusendiri
  // detailCategory: async (req, res) => {
  //   try {

  //   } catch (err) {
  //     return response(res, err.sqlMessage, {},res.status(500).statusCode, false)
  //   }
  // }
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params
      console.log(id)
      const schemaCategory = joi.object({
        name: joi.string()
      })

      const { value, error } = schemaCategory.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      }

      const updateCategory = await queryDB.updatePatchItem('categories', { ...value }, { id })

      if (updateCategory.affectedRows) {
        return response(res, `Category ID ${id} successfully updated`, { results: value }, res.status(200).statusCode, true)
      } else {
        return response(res, `Category ID ${id} fail to update`, {}, res.status(500).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params

      const deleteCategory = await queryDB.deleteItem('categories', { id })

      if (deleteCategory.affectedRows) {
        return response(res, `Category ID ${id} successfully deleted`, {}, res.status(200).statusCode, true)
      } else {
        return response(res, `Category ID ${id} fail to deleted`, {}, res.status(400).statusCode, false)
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  }
}
