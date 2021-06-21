const { Router } = require('express')
const router = Router()

const paymentControllers = require('../controllers/payment')

router.post('/add', paymentControllers.addPayment)

module.exports = router
