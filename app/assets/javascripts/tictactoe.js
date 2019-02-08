// Code your JavaScript / jQuery solution here
window.onload = () => {
  attachListeners()
}

window.turn = 0;
let gameId = 0;

const memo = {}

function player() {
  if (turn%2==0) {
    return "X"
  } else {
    return "O"
  }
}


function updateState(square) {
    square.innerHTML = player()
}

function setMessage(str) {
  document.getElementById("message").innerHTML = str
}

function checkWinner() {
  // row values increase as you move down
  // column values increase as you move right.
  const squares = Array.from(document.querySelectorAll("td"))
  const mySquares = squares.map(sq => sq.innerHTML)
  const winArray = []
  const myInd = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
  myInd.forEach(indArr => {
    let subStr = "";
    indArr.forEach(ind => subStr += mySquares[ind])
    winArray.push(subStr)
  })
  if (winArray.includes("XXX")){
    setMessage("Player X Won!")
    saveGame()
    return true
  } else if (winArray.includes("OOO")){
    setMessage("Player O Won!")
    saveGame()
    return true
  } else if (turn > 8) {
    setMessage("Tie game.")
    saveGame()
    return true
  }
  else {
    return false
  }
}

function doTurn(el) {
  updateState(el)
  turn++;
  const bool2 = checkWinner()
  if (bool2 == false) {
    setMessage("Tie game.")
  } else {
    Array.from(document.querySelectorAll("td")).forEach(sq => sq.innerHTML = "")
    turn = 0
  }
}

function attachListeners() {
  //used the solution on github for this. There may be a problem with the tests with plain javascript.
  $("td").on("click", function(){
    if (!$(this).text() && !checkWinner()){
      doTurn(this)
    }
  })

  //
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGame());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
  const squares = Array.from(document.querySelectorAll("td"))
  const mySquares = squares.map(sq => sq.innerHTML)
  if (gameId === 0){
    $.post("/games", {state: mySquares}, gameData => {
      gameId = gameData.data.id
    })
  } else {
    $.ajax( {type: "PATCH", url: "/games/" + gameId, data: {state: mySquares}})
  }
}

function previousGame() {
  $("#games").empty();
  $.get("/games", games => {
    games.data.forEach(game => {
      $("#games").append(`<button onclick="getPreviousGame(${game.id})"> game ${game.id}</button>`)
    })
    // buttons = "<button"
     // $("#games").innerHTML =
   })
}

function getPreviousGame(id) {
    $.get(`/games/${id}`, gameData => {
      gameId = gameData.data.id
      setBoard(gameData.data.attributes.state)
    })
}

function setBoard(gameState) {
  let myTurn = 0;
  Array.from($("td")).forEach((tile, index) => {
    if (gameState[index] != ""){
      myTurn += 1
    }
    tile.innerHTML = gameState[index]
  })
  turn = myTurn
}

function resetBoard() {
  $("td").text("")
  turn = 0;
  gameId = 0;
}
