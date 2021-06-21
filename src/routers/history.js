const { Router } = require('express')
const router = Router()

const historyController = require('../controllers/history')

router.get('/', historyController.getHistoryPayments)
router.delete('/delete/all', historyController.deleteAllYourHistory)
router.delete('/delete/:id', historyController.deleteHistoryById)

module.exports = router
