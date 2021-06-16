/* eslint-disable prefer-regex-literals */
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const queryDB = require('../helpers/query')

module.exports = {
  register: async (req, res) => {
    try {
      const registerSchema = joi.object({
        email: joi
          .string()
          .email()
          .required(),
        password: joi
          .string()
          .min(3)
          .required(),
        phone: joi
          .string()
          .regex(new RegExp('^[0-9]+$'))
          .min(11)
          .max(12)
          .required()
      })

      const { value, error } = registerSchema.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      } else {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(value.password, salt)
        // console.log(hash)
        const data = {
          ...value,
          password: hash
        }
        // console.log(data)

        const checkEmail = await queryDB.detailItem('profile', { email: value.email })
        // console.log('check Email', checkEmail)

        if (checkEmail.length) {
          return response(res, 'Email already registered', {}, res.status(400).statusCode, false)
        } else {
          // console.log('tidak ketemu')
          const checkPhone = await queryDB.detailItem('profile', { phone: value.phone })
          // console.log(checkPhone)
          if (checkPhone.length) {
            return response(res, 'Phone number already registered', {}, res.status(400).statusCode, false)
          } else {
            const signup = await queryDB.addItem('profile', data)
            if (signup.affectedRows) {
              return response(res, 'Registered successfully', { results: data }, res.status(200).statusCode, true)
            }
          }
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  },
  login: async (req, res) => {
    try {
      const loginSchema = joi.object({
        email: joi
          .string()
          .email()
          .required(),
        password: joi
          .string()
          .min(3)
          .required()
      })

      const { value, error } = loginSchema.validate(req.body)

      if (error) {
        return response(res, error.details[0].message, {}, res.status(400).statusCode, false)
      } else {
        const checkUser = await queryDB.detailItem('profile', { email: value.email })
        // console.log(checkUser)
        if (checkUser.length) {
          console.log(checkUser[0].password)
          const match = await bcrypt.compare(value.password, checkUser[0].password)
          if (match) {
            const user = {
              id: checkUser[0].id,
              email: checkUser[0].email,
              phone: checkUser[0].phone,
              username: checkUser[0].username,
              firstName: checkUser[0].first_name,
              lastName: checkUser[0].last_name,
              adress: checkUser[0].adress,
              birthdate: checkUser[0].birthdate,
              gender: checkUser[0].gender,
              photo: checkUser[0].photo
            }
            const token = await jwt.sign({ user }, process.env.APP_KEY)
            const data = {
              email: checkUser[0].email,
              password: checkUser[0].password,
              token
            }
            return response(res, 'Login successfully', { results: data }, res.status(200).statusCode, true)
          } else {
            return response(res, 'Password invalid', {}, res.status(400).statusCode, false)
          }
        } else {
          return response(res, 'Email not found', {}, res.status(400).statusCode, false)
        }
      }
    } catch (err) {
      return response(res, err.sqlMessage, {}, res.status(500).statusCode, false)
    }
  }
}
