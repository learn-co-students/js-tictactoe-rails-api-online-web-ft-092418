const WINS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
              [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
const tds = document.querySelectorAll('td');

window.turn = 0;
let index;
let token;
let gameID;

document.addEventListener("DOMContentLoaded", () => attachListeners());

var player = () => turn % 2 === 0 ? 'X' : 'O';
var updateState = target => target.innerHTML = player();
var setMessage = string => document.getElementById('message').innerHTML = string;

function checkWinner() {
  let board = getBoard();
  let winner = false;
  
  WINS.some(combo => {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });
  return winner;
}

function doTurn(target) {
  updateState(target);
  turn++;  
  if (checkWinner()) {
    save();
    reset();
  } else if (turn === 9) {
    setMessage('Tie game.');
    save();
    reset();
  }  
}

function attachListeners() {
  document.querySelector('table').addEventListener('click', event => {
    if (event.target.innerHTML === '' && !checkWinner()) {
      doTurn(event.target);
    }
  });
  document.getElementById('save').addEventListener('click', () => save());
  document.getElementById('previous').addEventListener('click', () => showPrevious());
  document.getElementById('clear').addEventListener('click', () => reset());
}

// tests require using xhr 
function save() {
  let data = { state: getBoard() };

  if (gameID) {
    $.ajax({
      type: 'patch',
      url: `/games/${gameID}`,
      data: data
    // fetch(`/games/${gameID}`, {
      // method: 'patch',
      // body: data,    
    });
  } else {
    $.post('/games', data, function(game) {
      gameID = game.data.id;
      createAndAppendGameButton(gameID);
    // fetch('/games', {
    //   method: 'post',
    //   body: data,
    // }).then(game => {
    //   gameID = game.data.id;
    });
  }
}

function showPrevious() {
  document.getElementById('games').innerHTML = '';
  $.get('/games', (games) => {
    if (games.data.length) {
      games.data.forEach(game => createAndAppendGameButton(game.id));
    }
  });
}

function createAndAppendGameButton(id) {
  $('#games').append(`<button id="gameid-${id}">${id}</button><br>`);
  $(`#gameid-${id}`).on('click', () => loadGame(id));
}

function reset() {
  turn = 0;
  gameID = 0;
  tds.forEach( td => td.innerHTML = '');
}

function loadGame(id) {
  const xhr = new XMLHttpRequest;
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/games/${id}`, true);
  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText).data;
    const id = data.id;
    const state = data.attributes.state;

    tds.forEach((td, index) => td.innerHTML = state[index]);
    turn = state.join('').length;
    gameID = id;
  };

  xhr.send(null);
}

function getBoard() {
  board = [];
  tds.forEach((td, index) => board[index] = td.innerHTML);
  return board;
}
