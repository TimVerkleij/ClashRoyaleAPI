const router = require('express').Router()
const NoSQL = require('nosql')
const request = require('../services/requests/clans')
const membersCheck = require('../services/requests/membersCheck')
const membersDB = NoSQL.load('./local.memberStats.nosql')

membersCheck.startScheduledMessage()

router.get('/test', (req, res) => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('addr: ' + add);
        res.json(add)
      })
    
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
    membersDB.find().make(function(filter) {
        filter.callback(function(err, response) {
            res.json({ response })
        });
    });
})

router.get('/members/:id', (req, res) => {
    membersDB.find().make(function(filter) {
        let memberId = "#" + req.params.id
        filter.where('id', '=', memberId)
        filter.callback(function(err, response) {
            res.json({ response: response[0] })
        });
    });
    // res.json(req.params.id)
})

module.exports = router