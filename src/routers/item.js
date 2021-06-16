const { Router } = require('express')
const router = Router()

const itemController = require('../controllers/item')

router.post('/add', itemController.addItem)
router.get('/detail/:id', itemController.detailItem)
router.patch('/update/:id', itemController.updateItem)
router.delete('/delete/:id', itemController.deleteItem)
router.get('/', itemController.allItem)

module.exports = router
