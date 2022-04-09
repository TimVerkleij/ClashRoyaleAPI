const NoSQL = require('nosql')
const db = NoSQL.load('./local.db.nosql')
const membersDB = NoSQL.load('./local.memberStats.nosql')
const cron = require('cron')
const request = require('./clans')

let scheduledMessage = new cron.CronJob('30 00 22 * * *', () => {
    console.log("Fetching members...")
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


        //! trying to remove users from database that are not in clan anymore
        members.forEach(member => {
            memberList.push(member.tag)
        })

        let currentMembers = await new Promise( (res, reject) => {
            membersDB.find().in('id', memberList).make(function (filter) {
                filter.callback((response) => {
                    res(response)
                })
            })
        })
        console.log(currentMembers)

        // await new Promise((res) => {
        //     membersDB.clear().callback(response => {
        //         res()
        //     })
        // })

        members.forEach(member => {
            memberList.push(member.tag)
            // membersDB.insert({id: member.tag, daysInClan: 0})
            membersDB.find().make(function (filter) {
                filter.where('id', '=', member.tag)

                filter.callback(function (err, response) {
                    // console.log(response[0])
                    if (response[0]) {
                        let daysInClan = parseInt(response[0].daysInClan) + 1
                        membersDB.modify({ daysInClan, name: member.name }).where('id', member.tag);
                    } else {
                        membersDB.insert({id: member.tag, name: member.name, daysInClan: 0, role: member.role})
                    }
                });
            });
            
        });
        

        // console.log(currentMembers, 'hello')

        // let idk = await membersDB.clear().callback(res => {
        //     console.log(res)
        //     console.log(currentMembers)
        //     membersDB.insert(currentMembers)
        // })
        // console.log(idk, 'idk')

        // currentMembers.forEach(async (member) => {
        //     await membersDB.insert({'id': member.id})
        // })
        // console.log(currentMembers)
        // membersDB.insert(currentMembers)
    })
})

function startScheduledMessage() {
    scheduledMessage.start();
}

module.exports = { startScheduledMessage }