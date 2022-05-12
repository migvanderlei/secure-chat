
const express = require('express');
const port = process.env.PORT || 3000;
const USERS = []

const P = 23
const G = 9

const PUBLIC_PAIRS = []

const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(express.json()) 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

app.get('/lobby', (req, res) => {
  res.sendFile(__dirname + '/html/lobby.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/html/chat.html');
});

app.get('/users', (req, res) => {
  res.json(USERS);
});

app.get('/publicValues', (req, res) => {
  res.json({ p: P, g: G });
})


app.post('/join', (req, res) => {
  const { username }= req.body

  if (USERS.indexOf(username) == -1) {
    USERS.push(username)
  } else {
    return res.status(400).send()
  }

  console.log(username)
  console.log(USERS)

  return res.status(200).send(USERS)

});

io.on('connection', (socket) => {
  socket.on('connectionRequest', msg => {
    io.emit('authorizeRequest', msg);
  });

  socket.on('acceptConnection', msg => {
    io.emit('connectionAccepted', msg);
  });

  socket.on('sendPublicNumber', msg => {
    io.emit('publicNumberReceived', msg)
  })

  socket.on('sendMessage', msg => {

    const { sender, message } = msg

    console.log({sender, message: message.toString()})
    io.emit('receiveMessage', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
