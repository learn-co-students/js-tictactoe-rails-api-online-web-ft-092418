$(document).ready(function() {
    attachListeners()
})

let turn = 0
let gameId = undefined

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
    var tds = document.querySelectorAll("td")

    var state = Array.from(tds).map(td => td.innerHTML)
    let body = JSON.stringify(state)
    if(gameId === undefined) {
        $.post('/games', {state: body} ,data => {
            gameId = data.data.id
            setMessage("Game Saved")
        }).fail(error => console.log(error))
     }else {
       $.ajax(`/games/${gameId}`,{
         method: 'PATCH',
         contentType: 'application/json',
         data: JSON.stringify({state: body, id: gameId})
       }).then(json => {
         console.log(json)
         setMessage("Game Updated")
       })
     }
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
        }
    })
}

function previousGames(){
  $.get('/games',json =>{

    $("#games").append(json.data.map(game => `<a href="#" onclick="showGame(${game.id})">${game.id}</a><br>`))
  })

}

function showGame(id){
  turn = 0
  $.get(`/games/${id}`,json =>{
    gameId = json.data.id
    setState(json.data.attributes.state)
  })
}

function setState(state){
  var tds = document.querySelectorAll("td")
  for (let i = 0; i < state.length; i++){
    if (state[i] !== ""){
      turn ++
    }
    tds[i].innerHTML = state[i]
  }
}

function clearGame(){
  setState(["","","","","","","","",""])
  turn = 0
}

function doTurn(event) {

    if (this.innerHTML === "") {
        updateState(this)
        checkWinner()
        turn ++
    }

    //setMessage("Tie game.")

}
