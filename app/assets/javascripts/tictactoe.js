// Code your JavaScript / jQuery solution here
$(document).ready(function() {
    attachListeners()
})

var turn = 0
var currentGame 

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

function attachListeners() {
    $('td').click(doTurn)

    $('#save').click(saveGame)
    $('#previous').click(previousGames)
    $('#clear').click(clearGame)
    
}

function saveGame() {
    event.preventDefault()
    var tds = document.querySelectorAll("td")   
    var data = {state: [tds[0].innerText, tds[1].innerText, tds[2].innerText, tds[3].innerText, tds[4].innerText, tds[5].innerText, tds[6].innerText, tds[7].innerText, tds[8].innerText]}
    $.ajax({
        type: currentGame ? 'PATCH' : 'POST',
        url: currentGame ? '/games/' + currentGame : '/games',
        data: data, 
        success: function(response) {
            currentGame = response.data.attributes.id
        }
     })
}

function previousGames() {
    event.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/games',
        success: function(response) {
            var gamelist = document.getElementById("games")
            while (gamelist.hasChildNodes()) { gamelist.removeChild(gamelist.firstChild)}
            response.data.map(a => $('#games').append('<li><a href="#" onclick="getGame(this)">' + a.id + '</a></li>'))
        }
    })
}

function getGame(content) {
    event.preventDefault()
    $.ajax({
        type: 'GET',
        url: '/games/' + parseInt(content.innerText),
        data: content.innerText,
        success: function(response) {
            setMessage("")
            currentGame = response.data.id
            $("td").each(function(e) {$(this).html(response.data.attributes.state[e])})
        }
    })
}

function clearGame() {
    event.preventDefault()
    setMessage("")
    var tds = document.querySelectorAll("td")
    tds[0].innerText = "", tds[1].innerText = "", tds[2].innerText = "", tds[3].innerText = "", tds[4].innerText = "", tds[5].innerText = "", tds[6].innerText = "", tds[7].innerText = "", tds[8].innerText = ""
}

function player(){
    return (turn % 2 === 0) ? "X" : "O"
}

function updateState(square) {
    square.innerHTML = player()

}

function setMessage(string) {
    $("#message").text(string)
}

function checkWinner() {
    var tds = document.querySelectorAll("td")
    winningCombinations.map(combo => {
        if(tds[combo[0]].innerHTML == tds[combo[1]].innerHTML && tds[combo[0]].innerHTML == tds[combo[2]].innerHTML && tds[combo[0]].innerHTML !== "") {
            setMessage(`Player ${player()} Won!`)
            return true
        }
    })
}

function doTurn(event) {
    if ( this.innerHTML === "" && $("#message")[0].innerText == "" ) {
        updateState(this)
        checkWinner()
        turn ++
    } else if ($("#message")[0].innerText !== "") {
        turn = 0
        debugger
    }
    
    //setMessage("Tie game.")
    
}

