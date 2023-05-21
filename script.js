var map_id = ["544408", "66733", "555936", "532992", "557955", "555606", "546669"]

async function getData(){
    var finalStandings = new Map()
    for(var i = 0; i < map_id.length; i++){
        var map = map_id[i]
        var responseurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/scores?countries=it&page=1'
        var pizziurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/scores?countries=us&search=sionpizzi'
        var zoomurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/scores?countries=us&search=xoomies'
        var mapdetailsurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/info'
        var response = await fetch(responseurl)
        var map_details = await fetch(mapdetailsurl)
        if(response.status != 404){
            
            var {scores} = await response.json()
            var pizziscore = await fetch(pizziurl)
            if(pizziscore.status != 404){
                var pizzi = await pizziscore.json()
                pizzi = pizzi.scores
                pizzi.forEach(element => {
                    scores.push(element)
                });
            }
            var zoomscore = await fetch(zoomurl)
            if(zoomscore.status != 404){
                var zoom = await zoomscore.json()
                zoom = zoom.scores
                zoom.forEach(element => {
                    scores.push(element)
                });
            }
            scores.sort((a,b) => (a.baseScore > b.baseScore) ? -1:1)
            map_details = await map_details.json()
            var {maxScore} = map_details
            var songName = map_details.songName + ' - '+ map_details.songAuthorName
            createNewTable(songName, map)
            var ID = []
            var rank = []
            var pfpUrl = []
            var name = []
            var perc = []
            var miss = []
            var totalpoints = []
            for(var j = 0; j < scores.length; j++){
                var points
                if (j + 1 < 4){
                    points = 1000
                }else if(j + 1 == 4){
                    points = 100
                }else if(j + 1 == 5){
                    points = 10
                }else{
                    points = 1
                }
                ID[j] = scores[j].leaderboardPlayerInfo.id
                rank[j] = j + 1
                pfpUrl[j] = scores[j].leaderboardPlayerInfo.profilePicture
                name[j] = scores[j].leaderboardPlayerInfo.name
                perc[j] = ((scores[j].baseScore / maxScore)* 100).toFixed(2)
                miss[j] = scores[j].missedNotes + scores[j].badCuts
                totalpoints[j] = points
                if (finalStandings.has(name[j])) {
                    const currentValue = finalStandings.get(name[j]);
                    finalStandings.set(name[j], currentValue + points);
                } 
                else {
                    finalStandings.set(name[j], points);
                }

            }
            populate(ID,rank,  pfpUrl ,  name, perc, miss, totalpoints, map)
        }
    }
    const sortedArray = Array.from(finalStandings).sort((a, b) => b[1] - a[1])
    console.log(sortedArray)
}

function createNewTable(songname, id){
    var table = document.getElementById('container')
    table.innerHTML += '<table id="'+ id +'"><caption>'+ songname + '<thead><tr><th class="first center">#</th class="center"><th></th><th>name</th><th>score</th><th class="lastMobile center">miss</th><th class="last mobileHide center">points</th></tr></thead><tbody id="body"></tbody></table>'
}

function populate(id, rank, pfp, name, perc, miss, points, map_id){
    var table = document.getElementById(map_id).childNodes[2]
    
    for(var i = 0; i < rank.length; i++){
        var row = document.createElement('tr')
        var rankcell = document.createElement('td')
        rankcell.classList.add("center")
        
        if(i < 4){
            rankcell.classList.add("green")
        }else if(i > 4){
            rankcell.classList.add("red")
        }

        var namecell = document.createElement('td')
        namecell.classList.add("name")
        var nameLink = document.createElement('a')
        nameLink.href = "https://scoresaber.com/u/" + id[i]
        var pfpcell = document.createElement('td')
        var pfpurl = document.createElement('img')
        pfpurl.src = pfp[i]
        pfpurl.classList.add("pfp", "center")
        var perccell = document.createElement('td')
        var misscell = document.createElement('td')
        misscell.classList.add("center")
        var pointscell = document.createElement('td')
        pointscell.classList.add("mobileHide" , "center")
        var dummy
        rankcell.appendChild(dummy = document.createTextNode(rank[i]))
        pfpcell.appendChild(pfpurl)
        nameLink.appendChild(dummy = document.createTextNode(name[i]))
        namecell.appendChild(nameLink)
        perccell.appendChild(dummy = document.createTextNode(perc[i]))
        misscell.appendChild(dummy = document.createTextNode(miss[i]))
        pointscell.appendChild(dummy = document.createTextNode(points[i]))
        row.appendChild(rankcell)
        row.appendChild(pfpcell)
        row.appendChild(namecell)
        row.appendChild(perccell)
        row.appendChild(misscell)
        row.appendChild(pointscell)
        table.appendChild(row)
    }
}