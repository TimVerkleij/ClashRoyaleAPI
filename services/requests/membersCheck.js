const NoSQL = require('nosql')
const db = NoSQL.load('./local.db.nosql')
const membersDB = NoSQL.load('./local.memberStats.nosql')
const cron = require('cron')
const request = require('./clans')

let scheduledMessage = new cron.CronJob('10 * * * * *', () => {
    console.log("Fetching members...")
    let memberList = []
    let memberStats = []
    request.memberData((response) => {
        let members = JSON.parse(response).items
        let date = `${new Date().getUTCDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
        // console.log(members)
        db.insert({ date, members })


        members.forEach(member => {
            memberList.push(member.tag)
            // membersDB.insert({id: member.tag, daysInClan: 0})
            membersDB.find().make(function (filter) {
                filter.where('id', '=', member.tag)

                filter.callback(function (err, response) {
                    // console.log(response[0])
                    if (response[0]) {
                        let daysInClan = parseInt(response[0].daysInClan) + 1
                        membersDB.modify({ daysInClan }).where('id', member.tag);
                    } else {
                        membersDB.insert({id: member.tag, daysInClan: 0, role: member.role})
                    }
                });
            });
        });
    })
})

function startScheduledMessage() {
    // scheduledMessage.start();
}

module.exports = { startScheduledMessage }