const router = require('express').Router()
const request = require('../services/requests/clans')

router.get('/test', (req, res) => {
    res.json('hi')
})

router.get('/clans', (req, res) => {
    request.clanData(function(response) {
        res.send(response)
    })
})

router.get('/wars', (req, res) => {
    request.warData(function(response) {
        res.send(response)
    })
})

router.get('/members', (req, res) => {
    request.memberData(function(response) {
        res.send(response)
    })
})

module.exports = router