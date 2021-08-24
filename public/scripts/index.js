fetch('/clans').then((response) => {
    return response.json();
}).then((data) => {
    let members = data.memberList
	let waarschuwLijst = []

    members.forEach(member => {
        let time = moment(member.lastSeen.toString())._d.valueOf()

        let timeDifference = moment.duration(moment(new Date).diff(moment(time))).asHours()

        let days = Math.floor(timeDifference / 24)
        let hours = Math.floor(timeDifference % 24)

        let laatstGezien

        if (days > 0) {
            laatstGezien = `${days} dagen en ${hours} uur`
        } else {
            laatstGezien = `${hours} uur`
        }

        member.laatstGezien = laatstGezien
    })

    const tableDiv = document.getElementById("tableDiv")
    const table = document.createElement("table")
	table.id = "table"
    const header = table.createTHead()
    const headerRow = header.insertRow(0)

    const headerCells = [
        "Naam",
        "Rol",
        "Laatst Gezien",
        "Fame",
        "Decks Gebruikt"
    ]
    headerCells.forEach(cell => {
        let headerCell = headerRow.insertCell(-1)
        headerCell.innerHTML = cell
    })


    fetch('/wars').then((response) => {
        return response.json();
    }).then((warData) => {

        warData = warData.items[0].standings.filter(clan => clan.clan.name == "Quality Dutch")[0].clan;

        const memberProperties = ["name", "role", "laatstGezien"]
        const tableBody = table.createTBody()
        members.forEach(member => {
            let memberRow = tableBody.insertRow(0)
            memberProperties.forEach(property => {
                let propertyCell = memberRow.insertCell(-1)
                propertyCell.innerHTML = member[property]
				
				if(member[property].includes("dagen") && member[property].split(" ")[0] >= 3 && member.name !== "timv13") {
					propertyCell.style.color = "red"
					propertyCell.style.fontWeight = "bold"
					memberRow.style.backgroundColor = "rgba(255, 0, 0, 0.347)"
				}
				
            })


            let fame = warData.participants.filter(participant => participant.tag == member.tag)[0].fame
            let decksUsed = warData.participants.filter(participant => participant.tag == member.tag)[0].decksUsed

            let propertyCell = memberRow.insertCell(-1)
            propertyCell.innerHTML = fame
			if(fame == 0) {
				waarschuwLijst.push(member.name)
				propertyCell.style.color = "red"
				propertyCell.style.fontWeight = "bold"
				memberRow.style.backgroundColor = "rgba(255, 0, 0, 0.347)"
			}
            propertyCell = memberRow.insertCell(-1)
            propertyCell.innerHTML = decksUsed
        })

        tableDiv.append(table)
		tableDiv.style.opacity = "100%"
		let loadingDiv = document.getElementById("loading")
		loadingDiv.style.opacity = "0%"
		// document.getElementById('warning').innerHTML = 
		waarschuwLijst.forEach(member => {
			document.getElementById('textarea').innerHTML += `${member} - `
		})
    })

}).catch(err => {
    console.log(err)
});


function copy() {
	document.querySelector("textarea").select();
    document.execCommand('copy');
}

function ExportToExcel(type, fn, dl) {
	var elt = document.getElementById('table');
	var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
	return dl ?
	  XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
	  XLSX.writeFile(wb, fn || ('MySheetName.' + (type || 'xlsx')));
 }