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
