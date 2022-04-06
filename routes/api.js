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
    // request.memberData(function(response) {
    //     res.send(response)
    // })
    membersDB.find().make(function(filter) {
        filter.callback(function(err, response) {
            res.json({ response })
        });
    });
    
})

module.exports = router