var map_id = ["520163", "520247", "517385", "511498", "531963", "529093", "446433", "406385", "515782", "226550", "38016", "354669", "70185", "100024", "114296"]

async function getData(){
    for(var i = 0; i < map_id.length; i++){
        var map = map_id[i]
        var responseurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/scores?countries=it&page=1'
        var pizziurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/scores?countries=us&search=sionpizzi'
        var mapdetailsurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/info'
        var response = await fetch(responseurl)
        var map_details = await fetch(mapdetailsurl)
        var {scores} = await response.json()
        map_details = await map_details.json()
        var {maxScore} = map_details
        var songName = map_details.songName + ' - '+ map_details.songAuthorName
        createNewTable(songName, map)
        var ID = []
        var name = []
        var perc = []
        var miss = []
        var totalpoints = []
        for(var j = 0; j < scores.length; j++){
            var points
            if (scores[j].rank < 3){
                points = 1000
            }else if(scores[j].rank == 3){
                points = 100
            }else if(scores[j].rank == 4){
                points = 10
            }else{
                points = 1
            }
            ID[j] = scores[j].rank
            name[j] = scores[j].leaderboardPlayerInfo.name
            perc[j] = ((scores[j].baseScore / maxScore)* 100).toFixed(2)
            miss[j] = scores[j].missedNotes
            totalpoints[j] = points
        }
        populate(ID, name, perc, miss, totalpoints, map)
    }
}

function createNewTable(songname, id){
    var table = document.getElementById('container')
    table.innerHTML += '<table id="'+ id +'"><caption>'+ songname + '<thead><tr><th class="first">#</th><th>name</th><th>score</th><th>miss</th><th class="last">points</th></tr></thead><tbody id="body"></tbody></table>'
}

function populate(ID, name, perc, miss, points, map_id){
    var table = document.getElementById(map_id).childNodes[2]
    
    for(var i = 0; i < ID.length; i++){
        var row = document.createElement('tr')
        var IDcell = document.createElement('td')
        var namecell = document.createElement('td')
        var perccell = document.createElement('td')
        var misscell = document.createElement('td')
        var pointscell = document.createElement('td')
        var dummy
        IDcell.appendChild(dummy = document.createTextNode(ID[i]))
        namecell.appendChild(dummy = document.createTextNode(name[i]))
        perccell.appendChild(dummy = document.createTextNode(perc[i]))
        misscell.appendChild(dummy = document.createTextNode(miss[i]))
        pointscell.appendChild(dummy = document.createTextNode(points[i]))
        row.appendChild(IDcell)
        row.appendChild(namecell)
        row.appendChild(perccell)
        row.appendChild(misscell)
        row.appendChild(pointscell)
        table.appendChild(row)
    }
}