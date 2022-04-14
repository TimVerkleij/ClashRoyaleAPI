const NoSQL = require('nosql')
const db = NoSQL.load('./local.db.nosql')
const membersDB = NoSQL.load('./local.memberStats.nosql')
const cron = require('cron')
const request = require('./clans')

let scheduledMessage = new cron.CronJob('15 * * * * *', () => {
    // console.log("Fetching members...")
    let memberList = []
    let memberStats = []
    request.memberData(async (response) => {
        let members
        try {
            members = JSON.parse(response).items

        } catch (err) {
            console.log("Something went wrong: " + err)
        }
        let date = `${new Date().getUTCDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
        // console.log(members)
        db.insert({ date, members })

        members.forEach(member => {
            memberList.push(member.tag)
        })

        let currentMembersInDB = await new Promise((res) => {
            membersDB.find().make(filter => {
                filter.callback( (err, response) => {
                    res(response)
                })
            })
        })

        currentMembersInDB.forEach(member => {
            let isInClan = memberList.includes(member.id)
            if(!isInClan) {
                membersDB.remove().make(filter => {
                    console.log(member.id)
                    filter.where('id', '=', member.id)
                    filter.callback( (err, response) => {
                        // console.log(response + " users left the clan today.")
                    })
                })
            }
        })

        members.forEach(member => {
            memberList.push(member.tag)
            membersDB.find().make(function (filter) {
                filter.where('id', '=', member.tag)

                filter.callback(function (err, response) {
                    if (response[0]) {
                        let daysInClan = parseInt(response[0].daysInClan) + 1
                        membersDB.modify({ daysInClan, name: member.name }).where('id', member.tag);
                    } else {
                        membersDB.insert({id: member.tag, name: member.name, daysInClan: 0, role: member.role})
                    }
                });
            });
            
        });
        
    })
})

function startScheduledMessage() {
    scheduledMessage.start();
}

module.exports = { startScheduledMessage }