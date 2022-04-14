fetch('/members').then((v) => {
    return v.json()
}).then((response) => {
    response = response.response

    let membersDiv = document.getElementById('membersDiv')
    response.forEach(member => {
        console.log(member)
        let memberCard = document.createElement('div')
        memberCard.className = "memberCard"
        let memberName = document.createElement('h3')
        memberName.className = "memberCardText"
        memberName.innerHTML = `${member.name}`
        let role = document.createElement('p')
        role.className = "memberCardText"
        role.innerHTML = `Rol: ${member.role}`
        let daysInClan = document.createElement('p')
        daysInClan.className = "memberCardText"
        daysInClan.innerHTML = ` Dagen in clan: ${member.daysInClan}`
        if(member.daysInClan >= 7 * 8 && member.role === 'member') {
            memberCard.style.backgroundColor = 'rgb(167, 167, 248)'
        }
        memberCard.append(memberName)
        memberCard.append(role)
        memberCard.append(daysInClan)
        membersDiv.append(memberCard)
    });
})