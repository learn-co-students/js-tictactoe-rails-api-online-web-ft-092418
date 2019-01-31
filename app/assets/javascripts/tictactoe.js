

var turn = 0
var currentGame = 0



function player(){
  if (turn%2 === 0){
    return "X"
  } else {
    return "O"
  }
}

function updateState(element) {
   
   $(element).text(player())
}


function setMessage(msg){
  $('#message').text(msg)
}

function checkWinner(){

  // console.log($('td[data-x="1"][data-y="0"]')[0].textContent);
  // console.log('=====');
  var char00 = $('td[data-x="0"][data-y="0"]')[0].textContent ;
  var char10 = $('td[data-x="1"][data-y="0"]')[0].textContent ;
  var char20 = $('td[data-x="2"][data-y="0"]')[0].textContent ;

  var char01 = $('td[data-x="0"][data-y="1"]')[0].textContent ;
  var char11 = $('td[data-x="1"][data-y="1"]')[0].textContent ;
  var char21 = $('td[data-x="2"][data-y="1"]')[0].textContent ;

  var char02 = $('td[data-x="0"][data-y="2"]')[0].textContent ;
  var char12 = $('td[data-x="1"][data-y="2"]')[0].textContent ;
  var char22 = $('td[data-x="2"][data-y="2"]')[0].textContent ;

  const combos = [ [char00 , char10 , char20] , [char01 , char11 , char21] , [char02 , char12 , char22],
  [char00 , char01 , char02] , [char10 , char11 , char12] , [char20 , char21 , char22] , [char00 , char11 , char22]
  ,  [char02 , char11 , char20] ]

  var msg = "";
  var won = false ;
  combos.forEach(function(combo){
      if(combo[0] ===combo[1] && combo[1] === combo[2] && combo[0] !== ""){
        won = true ;
        msg ="Player " + combo[0]+ " Won!";
        // console.log(combo);
      } else if (turn === 9){
        msg="Tie game.";
        won = true;
      }

  });

  // console.log(msg);
  setMessage(msg);
  return won;
}

function resetBoard() {
   $('td').empty()
   turn = 0
   currentGame = 0
}

function tieGame() {
   return turn === 9
}

function doTurn(element) {
   updateState(element)
   turn++
   if (checkWinner()) {
      saveBoard()
      resetBoard()
   } else if (tieGame()) {
      setMessage("Tie game.")
      saveBoard()
      resetBoard()
   }
}

function reloadGame(gameID) {
   setMessage("")

   $.get(`/games/${gameID}`, function(response) {
      const id = response.data.id
      const state = response.data.attributes.state
      debugger
      let index = 0
      for (let y = 0; y < 3; y++) {
         for (let x = 0; x < 3; x++) {
            document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index]
            index++
         }
      }

      turn = state.join('').length
      currentGame = id

      if (!checkWinner() && turn === 9) {
      setMessage('Tie game.')
      }
   })
}

function buttonizeGame(game) {
   $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
   $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
}

function saveBoard() {
   var board = []
   var gameData

   $('td').text((index, square) => {
      board[index] = square
   })

   gameData = { state: board }

   if (currentGame) {
      $.ajax({
         type: 'PATCH',
         url: `/games/${currentGame}`,
         data: gameData
     })
   } else {
      $.post('/games', gameData, function(game) {
         currentGame = game.data.id
         buttonizeGame(game.data)
      })
   }
}

function previousBoard() {
   $('#games').empty()
   $.get('/games', function(savedGames) {
      if (savedGames.data.length) {
         savedGames.data.forEach(game => {
            buttonizeGame(game)
         })
      }
   })
}

function attachListeners() {
   $('td').click(function() {
      if (!$.text(this) && !checkWinner() && !tieGame()) {
         doTurn(this)
      }
   })

   $('#clear').click(resetBoard)
   $('#save').click(saveBoard)
   $('#previous').click(previousBoard)
}


$(function() {
   attachListeners()
})
