fetch('/members').then((v) => {
    return v.json()
}).then((response) => {
    response = response.response

    let membersDiv = document.getElementById('membersDiv')
    response.forEach(member => {
        console.log(member)
        let memberCard = document.createElement('div')
        memberCard.className = "memberCard"
        let memberId = document.createElement('h3')
        memberId.innerHTML = `${member.name}`
        let daysInClan = document.createElement('p')
        daysInClan.innerHTML = ` Dagen in clan: ${member.daysInClan}`
        memberCard.append(memberId)
        memberCard.append(daysInClan)
        membersDiv.append(memberCard)
    });
})