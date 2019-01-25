// Code your JavaScript / jQuery solution here
$(document).ready(function() {
    attachListeners()
})

let turn = 0

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
    $('#previous').click(function(event) {
        
    })
    $('#clear').click(function(event) {
        
    })
    
}

function saveGame() {
    var tds = document.querySelectorAll("td")
    
    var value = Array.from(tds).map(td => td.innerHTML)
    
    if(document.querySelector("table").dataset.id === undefined) {
        fetch('/games.json', {
            method: 'POST',
            body: $(value).serializeArray()
        })
        .then(response => response.json())
        .then(json => console.log("itworked", json))
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

function doTurn(event) {
    if (this.innerHTML === "") {
        updateState(this)
        checkWinner()
        turn ++
    } 
    
    //setMessage("Tie game.")
    
}

