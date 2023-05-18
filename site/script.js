var map_id = ["520163", "520247", "517385", "511498", "531963", "529093", "446433", "406385", "515782", "226550", "38016", "354669", "70185", "100024", "114296"]

function getData(){
    map_id.forEach(async map => {
        var responseurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/scores?countries=it&page=1'
        var pizziurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/scores?countries=us&search=sionpizzi'
        var mapdetailsurl = 'https://corsproxy.io/?' + 'https://scoresaber.com/api/leaderboard/by-id/' + map + '/info'
        var response = await fetch(responseurl)
        var map_details = await fetch(mapdetailsurl)
        var {scores} = await response.json()
        map_details = await map_details.json()
        //saveJSON(map_details)
        var {maxScore} = map_details
        var element = document.getElementById('dummytext')
        var songName = map_details.songName + ' - '+ map_details.songAuthorName
        createNewTable(songName)
        var ID = []
        var name = []
        var perc = []

        var miss = []
        var totalpoints = []
        for(var i = 0; i < scores.length; i++){
            var points
            if (scores[i].rank < 3){
                points = 1000
            }else if(i == 3){
                points = 100
            }else if(i == 4){
                points = 10
            }else{
                points = 1
            }
            ID[i] = i + 1
            name[i] = scores[i].leaderboardPlayerInfo.name
            perc[i] = ((scores[i].baseScore / maxScore)* 100).toFixed(2)
            miss[i] = scores[i].missedNotes
            totalpoints[i] = points
        }
        for(var i = 0; i < map_id.length; i++ ){
            populate(songName, ID, name, perc, miss, points, scores.length)
        }

    })
}

function createNewTable(songname){
    var table = document.getElementById('table')
    table.innerHTML += '<table><caption>'+ songname + '<thead><tr><th>#</th><th>name</th><th>score</th><th>miss</th><th>points</th></tr></thead><tbody id="body"></tbody></table>'
}