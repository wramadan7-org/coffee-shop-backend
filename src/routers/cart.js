const { Router } = require('express')
const router = Router()
const cartController = require('../controllers/cart')

router.post('/add', cartController.addCart)
router.get('/', cartController.getCart)
router.patch('/update/:id', cartController.updateCart)
router.delete('/delete/:id', cartController.deleteCart)

module.exports = router
