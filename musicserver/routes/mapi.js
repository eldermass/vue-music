const router = require('koa-router')({
    prefix: '/mapi'
})

const controllers = require('../controllers/mapi')

router.get('/pageslider', controllers.pageslider)
router.get('/recommend', controllers.recommend)
router.get('/singerlist', controllers.singerlist)
router.get('/singersongs', controllers.singersongs)
router.get('/lyric', controllers.lyric)
router.get('/disclist', controllers.disclist)
router.get('/ranklist', controllers.ranklist)
router.get('/ranklistsongs', controllers.ranklistsongs)
router.get('/hotkey', controllers.hotkey)
router.get('/searching', controllers.searching)
router.get('/vkey', controllers.vkey)

module.exports = router