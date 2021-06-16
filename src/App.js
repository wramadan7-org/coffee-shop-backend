const express = require('express')
const app = express()
const { APP_PORT } = process.env

const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))

// const tokenAuth = require('./middlewares/auth')

const auth = require('./routers/auth')
const item = require('./routers/item')
const category = require('./routers/category')
const variant = require('./routers/variant')

app.use('/auth', auth)
app.use('/items', item)
app.use('/category', category)
app.use('/variant', variant)

app.listen(APP_PORT, () => {
  console.log(`PORT ${APP_PORT} SEDANG BERJALAN`)
})
