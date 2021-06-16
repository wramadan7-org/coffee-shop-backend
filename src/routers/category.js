const { Router } = require('express')
const router = Router()

const categoryController = require('../controllers/category')

router.post('/add', categoryController.addCategory)
router.get('/', categoryController.allCategory)
router.patch('/update/:id', categoryController.updateCategory)
router.delete('/delete/:id', categoryController.deleteCategory)

module.exports = router
