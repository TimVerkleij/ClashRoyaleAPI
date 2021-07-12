const router = require('express').Router()

router.get('/test', (req, res) => {
    res.json('hi')
})

module.exports = router