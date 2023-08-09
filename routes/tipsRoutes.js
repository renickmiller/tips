const express = require('express')
const router = express.Router()
const TipsController = require('../controllers/TipsController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, TipsController.createTip)
router.post('/add', checkAuth, TipsController.createTipSave)
router.get('/edit/:id', checkAuth, TipsController.updateTip)
router.post('/edit', checkAuth, TipsController.updateTipSave)
router.get('/dashboard', checkAuth, TipsController.dashboard)
router.post('/remove', checkAuth, TipsController.removeTip)
router.get('/', TipsController.showTips)

module.exports = router