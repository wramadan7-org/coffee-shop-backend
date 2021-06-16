require('dotenv').config()
const mysql = require('mysql')

const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

conn.connect(function (err) {
  if (err) throw err
  console.log('Connected')
})

module.exports = conn
