let socket = io()

function makeid() {
     let id = "";
     let letters = "ABCDEFGHIJKLGEGEEy4heakie5tSTUVWXYZabcdefgafgqagehijklmnopqrstuvwxyz0123456789ag3e7ywegsq36yegw3qtf";
     for (let i = 0; i < 30; i++) {
          id += letters.charAt(Math.floor(Math.random() * letters.length));
     }
     return id;
}

const USER_ID = makeid()

let namePromt = 'Input your name'

let USER_NAME = window.prompt(namePromt += '!')

nameCheck()

function nameCheck() {
     if(!USER_NAME) {
          USER_NAME = window.prompt(namePromt += '!')
     } else {
          return;
     }
     nameCheck()
}

let PLAYER_TWO_ID;

let PLAYER_TWO_NAME;

socket.emit('createdRoom', ROOM_ID, USER_ID, USER_NAME)

let users = {
     [USER_ID]: {
          username: USER_NAME,
          id: USER_ID,
          option: null,
          wins: 0,
          lost: 0,
          draws: 0
     },
}

socket.on('userJoin', (userID, userName) => {
     console.log(userID)
     users[userID] = {
          username: userName,
          id: userID,
          option: null,
          wins: 0,
          lost: 0,
          draws: 0
     }
     PLAYER_TWO_ID = userID;
     PLAYER_TWO_NAME = userName
})

socket.on('restartGame', (playerOne, playerTwo, RoomID) => {
     if(window.location.pathname.slice(1).toString() == RoomID.toString()) {
          users[playerOne]['option'] = null;
          users[playerTwo]['option'] = null;
          getElement('id', 'winnermsg').innerHTML = '';
          getElement('id', 'notifymsg').innerHTML = '';
          getElement('id', 'reset').style['display'] = 'none';
          allvoted = false;
          past = null;
          console.log('Socket emitted')
     }
})

if(USERS['players'][Object.keys(USERS['players'])[0]]) {
users[Object.keys(USERS['players'])[0]] = {
     username: Object.values(Object.values(USERS['players']))[0]['name'],
     id: Object.keys(USERS['players'])[0],
     option: null,
     wins: 0,
     lost: 0,
     draws: 0
}
PLAYER_TWO_ID = Object.keys(USERS['players'])[0];
PLAYER_TWO_NAME = Object.values(Object.values(USERS['players']))[0]['name'];
}


getElement('id', 'rock').addEventListener('click', async (e) => {
     e.preventDefault();
     if(users[USER_ID]['option'] !== null) {
          return;
     }
     users[USER_ID]['option'] = 'rock'
     let body = {
          option: 'rock',
          UserID: USER_ID,
          roomID: window.location.pathname.slice(1),
          userName: USER_NAME
     }
     const options = {
          'method': 'POST',
          'headers': {
               'content-type': 'application/json'
          },
          'body': JSON.stringify(body)
     }
     await fetch('/select', options)
})
getElement('id', 'scissors').addEventListener('click', async (e) => {
     e.preventDefault();
     if(users[USER_ID]['option'] !== null) {
          return;
     }
     users[USER_ID]['option'] = 'scissors'
     let body = {
          option: 'scissors',
          UserID: USER_ID,
          roomID: window.location.pathname.slice(1),
          userName: USER_NAME
     }
     const options = {
          'method': 'POST',
          'headers': {
               'content-type': 'application/json'
          },
          'body': JSON.stringify(body)
     }
     await fetch('/select', options)
})
getElement('id', 'paper').addEventListener('click', async (e) => {
     e.preventDefault();
     if(users[USER_ID]['option'] !== null) {
          return;
     }
     users[USER_ID]['option'] = 'paper'
     let body = {
          option: 'paper',
          UserID: USER_ID,
          roomID: window.location.pathname.slice(1),
          userName: USER_NAME
     }
     const options = {
          'method': 'POST',
          'headers': {
               'content-type': 'application/json'
          },
          'body': JSON.stringify(body)
     }
     await fetch('/select', options)
})

socket.on('UserSelected', async ({option, UserID, userName, RoomID }) => {
     console.log(true)
     if(RoomID.toString() === window.location.pathname.slice(1).toString()) {
          console.log(true)
          if(users[UserID]['option'] == null) users[UserID]['option'] = option;
          let winner;
          console.log('first user to joins option:', Object.values(users)[0]['option'])
          if(Object.values(users)[0]['option'] && Object.values(users)[1] && Object.values(users)[1]['option']) {
                winner = calcWinner({ 'userOne': { 'id': Object.values(users)[0]['id'],  'option': Object.values(users)[0]['option']}, 'userTwo': { 'id': Object.values(users)[1]['id'],  'option': Object.values(users)[1]['option']}})
          } else {
               winner = null;
          }
          let winnerMsg;
          if(winner !== null) {
          if(winner !== USER_ID && winner !== 'draw') winnerMsg = 'You lost!'
          else if(winner === USER_ID) winnerMsg = 'You Won!'
          else winnerMsg = 'Draw!'
          getElement('id', 'notifymsg').innerHTML =  ``
          getElement('id', 'reset').style['display'] = 'inline';
               getElement('id', 'winnermsg').innerHTML =  winnerMsg
               getElement('id', 'reset').style['display'] = 'inline';
          getElement('id', 'reset').style['display'] = 'inline';
          if(winner === 'draw') {
               users[USER_ID]['draws'] += 1;
               users[PLAYER_TWO_ID]['draws'] += 1;
          } else if(winner === USER_ID) {
               users[USER_ID]['wins'] += 1;
               users[PLAYER_TWO_ID]['lost'] += 1;
          } else {
               users[USER_ID]['lost'] += 1;
               users[PLAYER_TWO_ID]['wins'] += 1;
          }
          getElement('id', 'winCount').innerHTML = `Won: ${users[USER_ID]['wins']}`
          getElement('id', 'drawCount').innerHTML = `Draw: ${users[USER_ID]['draws']}`
          getElement('id', 'lostCount').innerHTML = `Lost: ${users[USER_ID]['lost']}`
     } else {
          getElement('id', 'notifymsg').innerHTML =  `${userName} has chosen`
     }
}
console.log(false)
})

function calcWinner({userOne, userTwo}) {
     if(userOne['option'].toLowerCase() == userTwo['option'].toLowerCase()) return 'draw';
     if(userOne['option'].toLowerCase() == 'rock' && userTwo['option'].toLowerCase() == 'scissors') return userOne['id'];
     if(userOne['option'].toLowerCase() == 'scissors' && userTwo['option'].toLowerCase() == 'paper') return userOne['id'];
     if(userOne['option'].toLowerCase() == 'paper' && userTwo['option'].toLowerCase() == 'rock') return userOne['id'];
     if(userTwo['option'].toLowerCase() == 'rock' && userOne['option'].toLowerCase() == 'scissors') return userTwo['id'];
     if(userTwo['option'].toLowerCase() == 'scissors' && userOne['option'].toLowerCase() == 'paper') return userTwo['id'];
     if(userTwo['option'].toLowerCase() == 'paper' && userOne['option'].toLowerCase() == 'rock') return userTwo['id'];
}

getElement('id', 'reset').addEventListener('click', (e) => {
     e.preventDefault()
     getElement('id', 'winnermsg').innerHTML = '';
     getElement('id', 'notifymsg').innerHTML = '';
     getElement('id', 'reset').style['display'] = 'none';
     socket.emit('restartBack', USER_ID, PLAYER_TWO_ID, ROOM_ID)
     console.log('Socket emitted')
     console.log(users)
})
