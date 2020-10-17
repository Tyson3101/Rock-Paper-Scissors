require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const PORT = process.env.PORT || 3000
const { v4: uuidV4 } = require('uuid')
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public/views'))
app.use(express.static(path.join(__dirname, 'public')))

let Allrooms = {
     rooms: {}
};

let { rooms } = Allrooms;

app.get('/', (req, res) => {
     res.render('index')
})

app.get('/:roomID', (req, res) => {
     const { roomID } = req.params;
     console.log(rooms)
     if(rooms[roomID]) {
     if(Object.values(rooms[roomID]['players']).length < 2) {
     res.render('game', {
          'RoomID': roomID,
          'Users': JSON.stringify(rooms[roomID])
     })
} else {
     res.send('Game full')
}
} else {
     res.send('Game not found')
}
})

app.post('/select', (req, res) => {
     const { option, UserID, roomID, userName } = req.body
     if(rooms[roomID]['players'][UserID]) rooms[roomID]['players'][UserID]['option'] = option
     console.log('Emitted')
     io.sockets.emit('UserSelected', { option: option, UserID: UserID, userName: userName, RoomID: roomID})
     res.sendStatus(200)
})

app.post('/:roomID', (req, res) => {
     const { roomID } = req.params;
     if(req.body['redirect'] == true) {
     if(rooms[roomID]) {
          if(Object.values(rooms[roomID]['players']).length == 2) {
               res.sendStatus(403);
          } else {
          res.json({ roomID: roomID});
          }
     } else {
          res.sendStatus(404);
     }
} else if(req.body['createRoom'] == true) {
     let madeRoomID = uuidV4();
     rooms[madeRoomID.toString()] = {'players': {}, 'playersvoted': { playeronevote: null, playertwovote: null, allvoted: null }};
     console.log(rooms)
     res.json({ roomID: madeRoomID });
} else {
     res.sendStatus(401)
}
})

io.on('connection', (socket) => {
     console.log('Socket.io')
     socket.on('disconnect', () => {
          console.log('user disconnected');
     });
     socket.on('createdRoom', (roomID, UserID, userName) => {
          console.log(rooms)
          if(rooms[roomID]) {
          rooms[roomID]['players'][UserID] = {'name': userName ,'option': null, 'id': UserID};
     }
          socket.join(roomID)
          socket.to(roomID).broadcast.emit('userJoin', UserID, userName)
          console.log(rooms)
     })
     socket.on('restartBack', (playerOne, playerTwo, RoomID) => {
          rooms[RoomID]['players'][playerOne]['option'] = null;
          rooms[RoomID]['players'][playerTwo]['option'] = null;
          rooms[RoomID]['playersvoted']['allvoted'] = null;
          rooms[RoomID]['playersvoted']['playertwovote'] = null;
          rooms[RoomID]['playersvoted']['playeronevote'] = null;
          console.log('Socket emitted')
          io.sockets.emit('restartGame', playerOne, playerTwo, RoomID)
          console.log(rooms[RoomID])
     })
})

http.listen(PORT, () => console.log(`http://localhost:${PORT}`))