const { Router } = require('express')
const router = Router()

const variantController = require('../controllers/variant')

router.post('/add', variantController.addVariant)
router.get('/', variantController.allVariant)
router.patch('/update/:id', variantController.updateVariant)
router.delete('/delete/:id', variantController.deleteVariant)

module.exports = router
